<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class ArticleController extends AbstractController
{
    /**
     * @Route("/article", name="article")
     */
    public function showArticle()
    {
        return $this->render('article/article.html.twig', [
            'controller_name' => 'ArticleController',
        ]);
    }
}
