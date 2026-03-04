<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Project;
use App\Entity\Skill;
use App\Entity\Experience;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Create admin user
        $admin = new User();
        $admin->setEmail('admin@example.com');
        $admin->setRoles(['ROLE_ADMIN', 'ROLE_USER']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $manager->persist($admin);

        // Create some skills
        $php = new Skill();
        $php->setName('PHP');
        $php->setType('hard');
        $php->setLevel(4);
        $manager->persist($php);

        $javascript = new Skill();
        $javascript->setName('JavaScript');
        $javascript->setType('hard');
        $javascript->setLevel(4);
        $manager->persist($javascript);

        $react = new Skill();
        $react->setName('React');
        $react->setType('hard');
        $react->setLevel(3);
        $manager->persist($react);

        $communication = new Skill();
        $communication->setName('Communication');
        $communication->setType('soft');
        $communication->setLevel(4);
        $manager->persist($communication);

        // Create some experiences
        $exp1 = new Experience();
        $exp1->setCompany('Tech Company ABC');
        $exp1->setTitle('Senior Developer');
        $exp1->setDescription('Led development of multiple web applications using Symfony and React');
        $exp1->setStartDate(new \DateTime('2020-01-01'));
        $exp1->setEndDate(null);
        $manager->persist($exp1);

        $exp2 = new Experience();
        $exp2->setCompany('Startup XYZ');
        $exp2->setTitle('Full Stack Developer');
        $exp2->setDescription('Developed and maintained web applications with PHP and JavaScript');
        $exp2->setStartDate(new \DateTime('2018-06-01'));
        $exp2->setEndDate(new \DateTime('2019-12-31'));
        $manager->persist($exp2);

        // Create a sample project
        $project = new Project();
        $project->setTitle('Portfolio Website');
        $project->setDescription('A personal portfolio website built with Symfony 7 and React 19, featuring a dark theme admin dashboard for managing projects, skills, and experiences with JWT authentication.');
        $project->setTechnologies(['Symfony', 'React', 'MySQL', 'Bootstrap', 'JavaScript']);
        $project->setImages([]);
        $project->setGithubLink('https://github.com/example/portfolio');
        $project->setDemoLink('https://portfolio.example.com');
        $manager->persist($project);

        $manager->flush();
    }
}
