import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold mb-2">Central de Ajuda</h1>
              <p className="text-gray-600">Encontre respostas para suas dúvidas sobre o Discovery Event's</p>
            </div>
            
            <div className="grid gap-8 mb-10">
              <Card>
                <CardHeader>
                  <CardTitle>Perguntas Frequentes</CardTitle>
                  <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Como funciona a compra de ingressos?</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">O processo de compra é simples e seguro:</p>
                        <ol className="list-decimal list-inside space-y-2 pl-4">
                          <li>Encontre o evento desejado na plataforma</li>
                          <li>Selecione o tipo e quantidade de ingressos</li>
                          <li>Preencha seus dados e informações de pagamento</li>
                          <li>Confirme a compra e receba seu ingresso por e-mail</li>
                        </ol>
                        <p className="mt-2">Os ingressos adquiridos também ficam disponíveis na área "Meus Ingressos" do seu perfil.</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Como recebo meus ingressos?</AccordionTrigger>
                      <AccordionContent>
                        <p>Após a confirmação da compra, enviamos automaticamente os ingressos para o e-mail cadastrado em sua conta. Além disso, todos os seus ingressos ficam disponíveis na seção "Meus Ingressos" no seu perfil, onde você pode visualizá-los e baixá-los a qualquer momento.</p>
                        <p className="mt-2">Os ingressos contêm um QR code único que será escaneado na entrada do evento.</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Como vender meus ingressos?</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">Para vender ingressos na plataforma:</p>
                        <ol className="list-decimal list-inside space-y-2 pl-4">
                          <li>Faça login na sua conta</li>
                          <li>Clique em "Vender" na barra de navegação</li>
                          <li>Preencha as informações do evento (título, local, data, etc.)</li>
                          <li>Adicione os detalhes dos ingressos (categoria, preço, quantidade)</li>
                          <li>Envie para aprovação e aguarde a confirmação</li>
                        </ol>
                        <p className="mt-2">Você receberá notificações sobre as vendas e os pagamentos serão processados conforme as políticas da plataforma.</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger>As compras são seguras?</AccordionTrigger>
                      <AccordionContent>
                        <p>Sim, todas as transações na Discovery Event's são protegidas por criptografia SSL. Utilizamos gateways de pagamento confiáveis e não armazenamos dados de cartão de crédito em nossos servidores.</p>
                        <p className="mt-2">Além disso, nosso sistema de verificação de ingressos garante a autenticidade e evita fraudes.</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-5">
                      <AccordionTrigger>Posso cancelar uma compra?</AccordionTrigger>
                      <AccordionContent>
                        <p>O cancelamento de compras depende da política do evento:</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                          <li>Alguns eventos permitem cancelamento com reembolso total até determinada data</li>
                          <li>Outros podem cobrar uma taxa de cancelamento</li>
                          <li>Há eventos que não permitem cancelamento</li>
                        </ul>
                        <p className="mt-2">As condições de cancelamento estão sempre disponíveis na página do evento antes da compra. Para solicitar um cancelamento, acesse a seção "Meus Ingressos" e siga as instruções.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contato</CardTitle>
                  <CardDescription>Precisa de mais ajuda? Entre em contato conosco</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-medium">Atendimento ao Cliente</h3>
                      <p className="text-sm text-gray-500">
                        Segunda a sexta, das 9h às 18h
                      </p>
                      <p className="text-sm">
                        Email: suporte@discoveryevents.com
                      </p>
                      <p className="text-sm">
                        Telefone: (11) 3456-7890
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Redes Sociais</h3>
                      <p className="text-sm text-gray-500">
                        Estamos disponíveis também nas redes sociais
                      </p>
                      <div className="flex space-x-4">
                        <a href="#" className="text-gray-600 hover:text-primary">
                          Instagram
                        </a>
                        <a href="#" className="text-gray-600 hover:text-primary">
                          Facebook
                        </a>
                        <a href="#" className="text-gray-600 hover:text-primary">
                          Twitter
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}