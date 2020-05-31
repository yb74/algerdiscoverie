<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Region;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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

    /**
     * @Route("/map/info", name="map_info")
     */
    public function showRegionData()
    {
        $entityManager = $this->getDoctrine()->getManager();
        $regions = $entityManager->getRepository(Region::class)->findAll();

        $data = [];
        foreach ($regions as $key => $region) {
            $data[$key] ['coords'] = $region->getCoords();
            $data[$key] ['name'] = $region->getName();
            $data[$key] ['description'] = $region->getDescription();
            $data[$key] ['ref'] = $region->getRef();
        }

        return $this->json($data);
    }
}