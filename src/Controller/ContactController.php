<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Form\ContactType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ContactController extends AbstractController
{
    /**
     * @Route("/contact", name="contact")
     */
    public function SendEmail(Request $request, \Swift_Mailer $mailer)
    {
        $contact = new Contact();
        $form = $this->createForm(ContactType::class, $contact);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // here we send the email
            $swiftMessage = (new \Swift_Message('New contact'))
            // we define sender
            ->setFrom($contact->getEmail())
            // we define receiver
            ->setTo('yb74@hotmail.fr')
                // We define the subject
            ->setSubject($contact->getSubject())

            // we create the message with the Twig view
            ->setBody(
                $this->renderView(
                    'emails/email_structure.html.twig', compact('contact')
                ),
                'text/html'
            );

            // Sending the message
            $mailer->send($swiftMessage); // swift message

            $this->addFlash('message', 'Your message has been sent with success !');

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($contact);
            $entityManager->flush();

            return $this->redirectToRoute('home');
        }

        return $this->render('contact/contact.html.twig', [
            'contactForm' => $form->createView(),
        ]);
    }
}
