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
        $project = new Project();
        $project->setTitle($request->request->get('title'));
        $project->setDescription($request->request->get('description'));
        
        // Handle technologies (JSON string to array)
        $technologies = json_decode($request->request->get('technologies', '[]'), true);
        $project->setTechnologies($technologies ?? []);
        
        $project->setGithubLink($request->request->get('githubLink'));
        $project->setDemoLink($request->request->get('demoLink'));

        // Handle image uploads
        $images = [];
        /** @var UploadedFile[] $uploadedFiles */
        $uploadedFiles = $request->files->get('images', []);
        
        foreach ($uploadedFiles as $uploadedFile) {
            if ($uploadedFile) {
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
        $project = $projectRepository->find($id);
        
        if (!$project) {
            return $this->json(['error' => 'Projet non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $project->setTitle($request->request->get('title'));
        $project->setDescription($request->request->get('description'));
        
        // Handle technologies
        $technologies = json_decode($request->request->get('technologies', '[]'), true);
        $project->setTechnologies($technologies ?? []);
        
        $project->setGithubLink($request->request->get('githubLink'));
        $project->setDemoLink($request->request->get('demoLink'));

        // Handle existing images
        $existingImages = json_decode($request->request->get('existingImages', '[]'), true) ?? [];
        
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
        /** @var UploadedFile[] $uploadedFiles */
        $uploadedFiles = $request->files->get('images', []);
        
        foreach ($uploadedFiles as $uploadedFile) {
            if ($uploadedFile) {
                $images[] = $this->uploadImage($uploadedFile, $slugger);
            }
        }
        
        $project->setImages($images);

        $em->flush();

        return $this->json($project, Response::HTTP_OK, [], ['groups' => 'project:read']);
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
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

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

    private function deleteImage(string $imagePath): void
    {
        $fullPath = __DIR__ . '/../../../public' . $imagePath;
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }
}
