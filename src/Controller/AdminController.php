<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use App\Repository\CommentRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    /**
     * @Route("/admin", name="admin")
     */
    public function index(ArticleRepository $articleRepository): Response
    {
        return $this->render('admin/admin.html.twig', [
            'articles' => $articleRepository->findAll(),
        ]);
    }

    /**
     * @Route("/admin/manageUsers", name="manageUsers")
     */
    public function DisplayUsers(UserRepository $userRepository): Response
    {
        return $this->render('admin/manageUsers.html.twig', [
            'users' => $userRepository->findAll(),
        ]);
    }

    /**
     * @Route("/admin/manageComments", name="manageComments")
     */
    public function DisplayComments(CommentRepository $commentRepository): Response
    {
        return $this->render('admin/manageComments.html.twig', [
            'comments' => $commentRepository->findAll(),
        ]);
    }
}
