<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\ArticleLike;
use App\Entity\Comment;
use App\Entity\User;
use App\Form\ArticleType;
use App\Form\CommentType;
use App\Form\UserArticleType;
use App\Repository\ArticleLikeRepository;
use App\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class ArticleController extends AbstractController
{
    /**
     * @Route("/article", name="article", methods={"GET"})
     */
    public function index(Request $request, PaginatorInterface $paginator): Response
    {
        $data = $this->getDoctrine()->getRepository(Article::class)->findBy([], ['createdAt' => 'desc']);

        $articles = $paginator->paginate(
            $data,
            $request->query->getInt('page', 1), // number of current page, 1 by default
            6
        );

        return $this->render('article/index.html.twig', [
            'articles' => $articles,
        ]);
    }

    /**
     * @Route("article/new", name="article_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $article = new Article();

        $form = $this->createForm(ArticleType::class, $article);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $article->setCreatedAt(new \DateTime());
//            $article->setPublished(true);

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($article);
            $entityManager->flush();

            return $this->redirectToRoute('admin');
        }

        return $this->render('article/new.html.twig', [
            'article' => $article,
            'form' => $form->createView(),
        ]);
    }

    // User form to create articles that will be in pending before admin validation
    /**
     * @Route("article/user/new", name="article_user_new", methods={"GET","POST"})
     */
    public function newUserArticle(Request $request): Response
    {
        $article = new Article();

        $form = $this->createForm(UserArticleType::class, $article);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $article->setCreatedAt(new \DateTime());
            $article->setPublished(false);

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($article);
            $entityManager->flush();

            return $this->redirectToRoute('article');
        }

        return $this->render('article/newUserArticle.html.twig', [
            'article' => $article,
            'userArticleForm' => $form->createView(),
        ]);
    }

    /**
     * @Route("article/show/{id}", name="article_show")
     */
    public function show(Article $article, Request $request, EntityManagerInterface $manager): Response
    {
        $comment = new Comment();

        $form = $this->createForm(CommentType::class, $comment);
        $form->handleRequest($request);

        $user = $this->getUser();

        if($form->isSubmitted() && $form->isValid()) {
            $comment->setCreatedAt(new \DateTime())
                ->setUsername($user)
                ->setReported(0)
                ->setArticle($article);

            $manager->persist($comment);
            $manager->flush();

            return $this->redirectToRoute('article_show', ['id' => $article->getId()]);
        }

        return $this->render('article/show.html.twig', [
            'article' => $article,
            'commentForm' => $form->createView()
        ]);
    }

    /**
     * @Route("article/{id}/edit", name="article_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Article $article): Response
    {
        $form = $this->createForm(ArticleType::class, $article);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('admin');
        }

        return $this->render('article/edit.html.twig', [
            'article' => $article,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("article/show/delete/{id}", name="article_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Article $article): Response
    {
        if ($this->isCsrfTokenValid('delete'.$article->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($article);
            $entityManager->flush();
        }

        return $this->redirectToRoute('admin');
    }


    /**
     *  @Route("/{id}/article/reportComment", name="report_comment", requirements={"id" = "\d+"})
     */
    public function reportComment(Comment $comment)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $report = $comment->getReported();
        $comment->setReported($report+1);
        $entityManager->persist($comment);
        $entityManager->flush();

        $this->addFlash(
            'notice',
            'The comment has been reported'
        );

        $comment->getArticle();

        return $this->redirectToRoute('article_show', ['id' => $comment->getArticle()->getId()]);
    }

    /**
     * Allow to like or dislike an article
     *
     * @Route("/article/{id}/like", name="article_like")
     *
     * @param Article $article
     * @param EntityManagerInterface $manager
     * @param ArticleLikeRepository $likeRepo
     * @return Response
     */
    public function like(Article $article, EntityManagerInterface $manager, ArticleLikeRepository $likeRepo):
    Response
    {
        $user = $this->getUser(); // current user (logged in user)

        if(!$user) return $this->json([
            'code' => 403,
            'message' => "Unauthorized"
        ], 403);

        if($article->isLikedByUser($user)) {
            $like = $likeRepo->findOneBy([
                'article' => $article,
                'user' => $user
            ]);

            $manager->remove($like);
            $manager->flush();

            return $this->json([
                'code' => 200,
                'message' => 'The like has been deleted',
                'likes' => $likeRepo->count(['article' => $article])
            ], 200);
        }

        $like = new ArticleLike();
        $like->setArticle($article)
             ->setUser($user);

        $manager->persist($like);
        $manager->flush();

        return$this->json([
            'code' => 200,
            'message' => 'The like has been added',
            'likes' => $likeRepo->count(['article' => $article])
            ], 200);
    }
}
