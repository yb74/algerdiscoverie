<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class MapController extends AbstractController
{
    /**
     * @Route("/map", name="map")
     */
    public function showMap()
    {
        return $this->render('map/map.html.twig', [
            'controller_name' => 'MapController',
        ]);
    }
}
