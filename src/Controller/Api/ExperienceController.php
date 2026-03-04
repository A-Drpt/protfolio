<?php

namespace App\Controller\Api;

use App\Entity\Experience;
use App\Repository\ExperienceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/experiences')]
#[IsGranted('ROLE_ADMIN')]
class ExperienceController extends AbstractController
{
    #[Route('', name: 'api_experiences_index', methods: ['GET'])]
    public function index(ExperienceRepository $experienceRepository): JsonResponse
    {
        $experiences = $experienceRepository->findBy([], ['startDate' => 'DESC']);
        
        return $this->json($experiences, Response::HTTP_OK, [], ['groups' => 'experience:read']);
    }

    #[Route('', name: 'api_experiences_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $experience = new Experience();
        $experience->setCompany($data['company']);
        $experience->setTitle($data['title']);
        $experience->setDescription($data['description']);
        $experience->setStartDate(new \DateTime($data['startDate']));
        
        if (isset($data['endDate']) && $data['endDate']) {
            $experience->setEndDate(new \DateTime($data['endDate']));
        }

        $em->persist($experience);
        $em->flush();

        return $this->json($experience, Response::HTTP_CREATED, [], ['groups' => 'experience:read']);
    }

    #[Route('/{id}', name: 'api_experiences_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        ExperienceRepository $experienceRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $experience = $experienceRepository->find($id);
        
        if (!$experience) {
            return $this->json(['error' => 'Expérience non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $experience->setCompany($data['company']);
        $experience->setTitle($data['title']);
        $experience->setDescription($data['description']);
        $experience->setStartDate(new \DateTime($data['startDate']));
        
        if (isset($data['endDate']) && $data['endDate']) {
            $experience->setEndDate(new \DateTime($data['endDate']));
        } else {
            $experience->setEndDate(null);
        }

        $em->flush();

        return $this->json($experience, Response::HTTP_OK, [], ['groups' => 'experience:read']);
    }

    #[Route('/{id}', name: 'api_experiences_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        ExperienceRepository $experienceRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $experience = $experienceRepository->find($id);
        
        if (!$experience) {
            return $this->json(['error' => 'Expérience non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($experience);
        $em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
