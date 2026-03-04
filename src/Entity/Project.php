<?php

namespace App\Entity;

use App\Repository\ProjectRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['project:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['project:read'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['project:read'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::JSON)]
    #[Groups(['project:read'])]
    private array $technologies = [];

    #[ORM\Column(type: Types::JSON)]
    #[Groups(['project:read'])]
    private array $images = [];

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['project:read'])]
    private ?string $githubLink = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['project:read'])]
    private ?string $demoLink = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getTechnologies(): array
    {
        return $this->technologies;
    }

    public function setTechnologies(array $technologies): static
    {
        $this->technologies = $technologies;
        return $this;
    }

    public function getImages(): array
    {
        return $this->images;
    }

    public function setImages(array $images): static
    {
        $this->images = $images;
        return $this;
    }

    public function getGithubLink(): ?string
    {
        return $this->githubLink;
    }

    public function setGithubLink(?string $githubLink): static
    {
        $this->githubLink = $githubLink;
        return $this;
    }

    public function getDemoLink(): ?string
    {
        return $this->demoLink;
    }

    public function setDemoLink(?string $demoLink): static
    {
        $this->demoLink = $demoLink;
        return $this;
    }
}
