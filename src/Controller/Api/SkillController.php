<?php

namespace App\Controller\Api;

use App\Entity\Skill;
use App\Repository\SkillRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/skills')]
#[IsGranted('ROLE_ADMIN')]
class SkillController extends AbstractController
{
    #[Route('', name: 'api_skills_index', methods: ['GET'])]
    public function index(SkillRepository $skillRepository): JsonResponse
    {
        $skills = $skillRepository->findAll();
        
        return $this->json($skills, Response::HTTP_OK, [], ['groups' => 'skill:read']);
    }

    #[Route('', name: 'api_skills_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $skill = new Skill();
        $skill->setName($data['name']);
        $skill->setType($data['type']); // 'hard' or 'soft'
        $skill->setLevel((int)$data['level']);

        $em->persist($skill);
        $em->flush();

        return $this->json($skill, Response::HTTP_CREATED, [], ['groups' => 'skill:read']);
    }

    #[Route('/{id}', name: 'api_skills_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        SkillRepository $skillRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $skill = $skillRepository->find($id);
        
        if (!$skill) {
            return $this->json(['error' => 'Compétence non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $skill->setName($data['name']);
        $skill->setType($data['type']);
        $skill->setLevel((int)$data['level']);

        $em->flush();

        return $this->json($skill, Response::HTTP_OK, [], ['groups' => 'skill:read']);
    }

    #[Route('/{id}', name: 'api_skills_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        SkillRepository $skillRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $skill = $skillRepository->find($id);
        
        if (!$skill) {
            return $this->json(['error' => 'Compétence non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($skill);
        $em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
