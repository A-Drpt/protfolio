<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(
        #[CurrentUser] ?User $user,
        JWTTokenManagerInterface $JWTManager
    ): JsonResponse {
        if (!$user) {
            return $this->json([
                'message' => 'Missing credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $token = $JWTManager->create($user);

        return $this->json([
            'user' => [
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ],
            'token' => $token,
        ]);
    }

    #[Route('/status', name: 'api_auth_status', methods: ['GET'])]
    public function status(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json([
                'authenticated' => false,
            ]);
        }

        return $this->json([
            'authenticated' => true,
            'user' => [
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ],
        ]);
    }

    #[Route('/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        return $this->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
