<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Comment;
use App\Entity\User;
use App\Repository\ArticleRepository;
use App\Repository\CommentRepository;
use App\Repository\UserRepository;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    /**
     * @Route("/admin", name="admin")
     */
    public function index(Request $request, PaginatorInterface $paginator): Response
    {
        $data = $this->getDoctrine()->getRepository(Article::class)->findBy([], ['createdAt' => 'desc']);

        $articles = $paginator->paginate(
            $data,
            $request->query->getInt('page', 1), // number of current page, 1 by default
            6
        );

        return $this->render('admin/admin.html.twig', [
            'articles' => $articles,
        ]);
    }

    /**
     * @Route("/admin/pendingArticles", name="pendingArticles")
     */
    public function manageArticles(Request $request, PaginatorInterface $paginator): Response
    {
        $data = $this->getDoctrine()->getRepository(Article::class)->findBy(['published' => false]);

        $articles = $paginator->paginate(
            $data,
            $request->query->getInt('page', 1), // number of current page, 1 by default
            3
        );

        return $this->render('admin/pendingArticles.html.twig', [
            'articles' => $articles,
        ]);
    }

    /**
     *  @Route("/{id}/admin/managePendingArticles", name="manage_pending_articles", requirements={"id" = "\d+"})
     */
    public function ManagePendingArticles(Article $article)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $article->setPublished(true);
        $entityManager->persist($article);
        $entityManager->flush();

        return $this->redirectToRoute('pendingArticles');
    }

    /**
     * @Route("/admin/manageUsers", name="manageUsers")
     */
    public function DisplayUsers(Request $request, PaginatorInterface $paginator): Response
    {
        $data = $this->getDoctrine()->getRepository(User::class)->findBy([], ['CreatedAt' => 'desc']);

        $users = $paginator->paginate(
            $data,
            $request->query->getInt('page', 1), // number of current page, 1 by default
            3
        );

        return $this->render('admin/manageUsers.html.twig', [
            'users' => $users,
        ]);
    }

    /**
     *  @Route("/{id}/admin/manageUsers/delete", name="delete_user", requirements={"id" = "\d+"})
     */
    public function deleteUser(User $user)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($user);
        $entityManager->flush();

        return $this->redirectToRoute('manageUsers');
    }

    /**
     * @Route("/admin/manageComments", name="manageComments")
     */
    public function DisplayComments(Request $request, PaginatorInterface $paginator): Response
    {
        $data = $this->getDoctrine()->getRepository(Comment::class)->findBy([], ['reported' => 'desc']);

        $comments = $paginator->paginate(
            $data,
            $request->query->getInt('page', 1), // number of current page, 1 by default
            3
        );

        return $this->render('admin/manageComments.html.twig', [
            'comments' => $comments,
        ]);
    }

    /**
     * @Route("/{id}/admin/manageComments/unreport", name="unreport_comment", requirements={"id" = "\d+"})
     */
    public function unreportComment(Comment $comment)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $comment->setReported(0);
        $entityManager->persist($comment);
        $entityManager->flush();

        return $this->redirectToRoute('manageComments');
    }

    /**
     *  @Route("/{id}/admin/manageComments/delete", name="delete_comment", requirements={"id" = "\d+"})
     */
    public function deleteComment(Comment $comment)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($comment);
        $entityManager->flush();

        return $this->redirectToRoute('manageComments');
    }
}
