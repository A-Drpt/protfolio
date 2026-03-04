<?php

namespace App\Entity;

use App\Repository\SkillRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SkillRepository::class)]
class Skill
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['skill:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['skill:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 50)]
    #[Groups(['skill:read'])]
    private ?string $type = null; // 'hard' or 'soft'

    #[ORM\Column]
    #[Groups(['skill:read'])]
    private ?int $level = null; // 1-5

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getType(): string
    {
        return (string) ($this->type ?? 'hard');
    }

    public function setType(string $type): static
    {
        $this->type = $type;
        return $this;
    }

    public function getLevel(): int
    {
        return (int) ($this->level ?? 1);
    }

    public function setLevel(int $level): static
    {
        $this->level = $level;
        return $this;
    }
}
