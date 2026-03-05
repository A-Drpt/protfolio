<?php

namespace App\Controller\Api;

use App\Entity\Project;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api/admin/projects')]
#[IsGranted('ROLE_ADMIN')]
class ProjectController extends AbstractController
{
    private string $uploadsDir;

    public function __construct()
    {
        $this->uploadsDir = __DIR__ . '/../../../public/uploads/projects';
    }

    #[Route('', name: 'api_projects_index', methods: ['GET'])]
    public function index(ProjectRepository $projectRepository): JsonResponse
    {
        $projects = $projectRepository->findBy([], ['id' => 'DESC']);
        
        return $this->json($projects, Response::HTTP_OK, [], ['groups' => 'project:read']);
    }

    #[Route('', name: 'api_projects_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        SluggerInterface $slugger
    ): JsonResponse {
        $title = (string) ($request->request->get('title') ?? '');
        $description = (string) ($request->request->get('description') ?? '');

        if ('' === trim($title) || '' === trim($description)) {
            return $this->json(['error' => 'Le titre et la description sont requis.'], Response::HTTP_BAD_REQUEST);
        }

        $project = new Project();
        $project->setTitle($title);
        $project->setDescription($description);
        
        // Handle technologies (JSON string to array)
        $technologies = json_decode($request->request->get('technologies', '[]'), true);
        $project->setTechnologies($technologies ?? []);
        
        $project->setGithubLink($request->request->get('githubLink') ?? $request->request->get('github_link'));
        $project->setDemoLink($request->request->get('demoLink') ?? $request->request->get('demo_link'));

        // Handle image uploads
        $images = [];
        $uploadedFiles = $this->extractUploadedImages($request);
        
        foreach ($uploadedFiles as $uploadedFile) {
            if ($uploadedFile instanceof UploadedFile && $uploadedFile->isValid()) {
                $images[] = $this->uploadImage($uploadedFile, $slugger);
            }
        }
        
        $project->setImages($images);

        $em->persist($project);
        $em->flush();

        return $this->json($project, Response::HTTP_CREATED, [], ['groups' => 'project:read']);
    }

    #[Route('/{id}', name: 'api_projects_update', methods: ['POST'])]
    public function update(
        int $id,
        Request $request,
        ProjectRepository $projectRepository,
        EntityManagerInterface $em,
        SluggerInterface $slugger
    ): JsonResponse {
        try {
            $project = $projectRepository->find($id);
            
            if (!$project) {
                return $this->json(['error' => 'Projet non trouvé'], Response::HTTP_NOT_FOUND);
            }

            $title = (string) ($request->request->get('title') ?? $project->getTitle() ?? '');
            $description = (string) ($request->request->get('description') ?? $project->getDescription() ?? '');

            if ('' === trim($title) || '' === trim($description)) {
                return $this->json(['error' => 'Le titre et la description sont requis.'], Response::HTTP_BAD_REQUEST);
            }

            $project->setTitle($title);
            $project->setDescription($description);
        
        // Handle technologies
        $technologies = json_decode($request->request->get('technologies', '[]'), true);
        $project->setTechnologies($technologies ?? []);
        
        $project->setGithubLink($request->request->get('githubLink') ?? $request->request->get('github_link'));
        $project->setDemoLink($request->request->get('demoLink') ?? $request->request->get('demo_link'));

        // Handle existing images
        $existingImagesRaw = $request->request->get('existingImages') ?? $request->request->get('existing_images', '[]');
        $existingImages = json_decode((string) $existingImagesRaw, true) ?? [];
        
        // Delete images that were removed
        $currentImages = $project->getImages() ?? [];
        foreach ($currentImages as $currentImage) {
            if (!in_array($currentImage, $existingImages)) {
                $this->deleteImage($currentImage);
            }
        }

        // Start with existing images
        $images = $existingImages;

        // Handle new image uploads
        $uploadedFiles = $this->extractUploadedImages($request);
        
        foreach ($uploadedFiles as $uploadedFile) {
            if ($uploadedFile instanceof UploadedFile && $uploadedFile->isValid()) {
                $images[] = $this->uploadImage($uploadedFile, $slugger);
            }
        }
        
        $project->setImages($images);

        $em->flush();

        return $this->json($project, Response::HTTP_OK, [], ['groups' => 'project:read']);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'api_projects_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        ProjectRepository $projectRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $project = $projectRepository->find($id);
        
        if (!$project) {
            return $this->json(['error' => 'Projet non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Delete all associated images
        foreach ($project->getImages() ?? [] as $image) {
            $this->deleteImage($image);
        }

        $em->remove($project);
        $em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    private function uploadImage(UploadedFile $file, SluggerInterface $slugger): string
    {
        if (!$file->isValid()) {
            throw new \RuntimeException('Fichier image invalide.');
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        
        // Ensure slug is not empty - use a fallback
        if (empty($safeFilename)) {
            $safeFilename = 'image';
        }
        
        $extension = $file->guessExtension() ?: $file->getClientOriginalExtension() ?: 'bin';
        // Clean extension to remove any invalid characters
        $extension = preg_replace('/[^a-z0-9]/i', '', $extension);
        if (empty($extension)) {
            $extension = 'bin';
        }
        
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $extension;

        try {
            if (!is_dir($this->uploadsDir)) {
                mkdir($this->uploadsDir, 0755, true);
            }
            $file->move($this->uploadsDir, $newFilename);
        } catch (FileException $e) {
            throw new \RuntimeException('Erreur lors de l\'upload de l\'image: ' . $e->getMessage());
        }

        return '/uploads/projects/' . $newFilename;
    }

    /**
     * @return UploadedFile[]
     */
    private function extractUploadedImages(Request $request): array
    {
        $files = [];
        
        // Try to get files with 'images[]' key
        $arrayImages = $request->files->get('images');
        
        if (is_array($arrayImages)) {
            $files = $arrayImages;
        } elseif ($arrayImages instanceof UploadedFile) {
            $files = [$arrayImages];
        }
        
        // If nothing found, try all() method
        if (empty($files)) {
            $allImages = $request->files->all('images');
            if ($allImages) {
                $files = is_array($allImages) ? $allImages : [$allImages];
            }
        }
        
        // Filter to keep only valid UploadedFile instances
        return array_values(array_filter(
            $files,
            static fn ($file) => $file instanceof UploadedFile
        ));
    }

    private function deleteImage(string $imagePath): void
    {
        $fullPath = __DIR__ . '/../../../public' . $imagePath;
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }
}
