<?php

namespace App\Controller;

use App\Repository\ProjectRepository;
use App\Repository\SkillRepository;
use App\Repository\ExperienceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(
        ProjectRepository $projectRepository,
        SkillRepository $skillRepository,
        ExperienceRepository $experienceRepository
    ): Response {
        $projects = $projectRepository->findBy([], ['id' => 'DESC'], 3);
        $skills = $skillRepository->findAll();
        $experiences = $experienceRepository->findBy([], ['startDate' => 'DESC']);

        return $this->render('main/index.html.twig', [
            'projects' => $projects,
            'skills' => $skills,
            'experiences' => $experiences,
        ]);
    }

    #[Route('/projects', name: 'app_projects')]
    public function projects(ProjectRepository $projectRepository): Response
    {
        $projects = $projectRepository->findBy([], ['id' => 'DESC']);

        return $this->render('main/projects.html.twig', [
            'projects' => $projects,
        ]);
    }

    #[Route('/project/{id}', name: 'app_project_detail')]
    public function projectDetail(int $id, ProjectRepository $projectRepository): Response
    {
        $project = $projectRepository->find($id);

        if (!$project) {
            throw $this->createNotFoundException('Projet non trouvé');
        }

        return $this->render('main/project_detail.html.twig', [
            'project' => $project,
        ]);
    }

    #[Route('/contact', name: 'app_contact')]
    public function contact(Request $request): Response
    {
        // TODO: Implement contact form handling
        return $this->render('main/contact.html.twig');
    }
}
