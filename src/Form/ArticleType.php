<?php

namespace App\Form;

use App\Entity\Article;
use App\Entity\Category;
use App\Entity\Region;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Vich\UploaderBundle\Form\Type\VichImageType;

class ArticleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title')
            ->add('content', TextareaType::class /*[
                'attr' => [
                    'class' => 'tinyForm',
                    'data-theme' => 'medium' // simple, advanced, bbcode
                ],
            ]*/)
            ->add('imageFile', VichImageType::class, [
                 'required' => true,
                 'allow_delete' => true,
                 'download_label' => '...',
                 'download_uri' => true,
                 'image_uri' => true,
                 'asset_helper' => true,
             ])
            ->add('region', EntityType::class, [
                'class' => Region::class,
                'choice_label' => 'name'
            ])
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name'
            ])
            ->add('published')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Article::class,
        ]);
    }
}
