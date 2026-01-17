
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { 
  Star, 
  Menu, 
  X, 
  Mail, 
  Phone, 
  Instagram, 
  Check, 
  LogOut, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  User,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Assets Fallbacks ---
const ASSETS = {
  logo: "https://placehold.co/280x80/081f2e/c49a50?text=Lopes+%26+Lopes",
  hero: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000",
  clecio: "https://placehold.co/400x600/081f2e/c49a50?text=Dr.+Clecio+Lopes",
};

// --- Components ---

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'INÍCIO', href: '/#hero' },
    { name: 'ÁREAS DE ATUAÇÃO', href: '/#solucoes' },
    { name: 'SOBRE', href: '/#sobre' },
    { name: 'PROFISSIONAL', href: '/#equipe' },
    { name: 'DEPOIMENTOS', href: '/#depoimentos' },
    { name: 'BLOG', href: '/#blog' },
    { name: 'ENDEREÇO', href: '/#endereco' },
    { name: 'CONTATOS', href: '/#contato' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (location.pathname !== '/') {
        window.location.href = '#/' + id;
      }
      setIsOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary shadow-lg h-20' : 'bg-primary h-24'}`}>
      <div className="container mx-auto px-6 h-full flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="logo-lopes-&-lopes.png" 
            alt="Lopes & Lopes" 
            className="h-12 md:h-16 transition-transform hover:scale-105" 
            onError={(e) => (e.currentTarget.src = ASSETS.logo)}
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-white text-xs font-bold hover:text-accent transition-colors tracking-wider uppercase"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="https://wa.me/5531985835742" 
            className="border border-accent text-accent px-4 py-2 rounded text-sm font-bold flex items-center space-x-2 hover:bg-accent hover:text-primary transition-all"
          >
            <Phone size={16} />
            <span>(31) 98583-5742</span>
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-accent" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-primary z-40 flex flex-col justify-center items-center space-y-8 lg:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-white text-xl font-bold hover:text-accent tracking-widest"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="https://wa.me/5531985835742" 
              className="text-accent border border-accent px-8 py-3 rounded-full text-lg font-bold"
            >
              (31) 98583-5742
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

const SectionHeading = ({ title, subtitle, light = false }: { title: string, subtitle?: string, light?: boolean }) => (
  <div className="text-center mb-12 fade-in">
    <h2 className={`text-3xl md:text-4xl font-bold uppercase mb-4 ${light ? 'text-white' : 'text-primary'}`}>
      {title}
    </h2>
    <div className="w-16 h-1 bg-accent mx-auto mb-6"></div>
    {subtitle && <p className={`max-w-2xl mx-auto text-lg ${light ? 'text-gray-300' : 'text-gray-600'}`}>{subtitle}</p>}
  </div>
);

const Footer = () => (
  <footer className="bg-black text-gray-500 py-12 px-6 border-t-4 border-accent text-center">
    <div className="container mx-auto">
      <div className="flex justify-center space-x-6 mb-6 text-white uppercase text-sm font-semibold">
        <Link to="/termos" className="hover:text-accent">Termos de Uso</Link>
        <span>|</span>
        <Link to="/privacidade" className="hover:text-accent">Política de Privacidade</Link>
      </div>
      <p className="mb-2">CNPJ: 18.394.767/0001-08</p>
      <p className="font-bold text-gray-400 uppercase tracking-widest mb-4 text-xs md:text-base">Lopes & Lopes Advocacia</p>
      <p className="text-xs">© {new Date().getFullYear()} Lopes & Lopes Advocacia. Todos os direitos reservados.</p>
    </div>
  </footer>
);

// --- Pages ---

const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchTestimonials();

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('depoimentos')
        .select('*')
        .eq('aprovado', true)
        .order('created_at', { ascending: false });
      
      if (data) setTestimonials(data);
    } catch (e) {
      console.error("Erro ao buscar depoimentos", e);
    }
  };

  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/#/'
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const submitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('depoimentos').insert([{
      nome: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url,
      estrelas: rating,
      texto: text,
      aprovado: false
    }]);

    setLoading(false);
    if (!error) {
      alert('Depoimento enviado para aprovação do administrador!');
      setText('');
      setRating(5);
    } else {
      alert('Erro ao enviar depoimento.');
    }
  };

  return (
    <div className="pt-24 overflow-x-hidden">
      {/* Hero */}
      <section id="hero" className="relative h-screen min-h-[600px] flex items-center bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="background-hero.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30" 
            onError={(e) => (e.currentTarget.src = ASSETS.hero)}
          />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Excelência Jurídica <span className="text-accent italic">Multidisciplinar</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-xl">
              Unimos o Direito, a Contabilidade e a Expertise Imobiliária para oferecer soluções estratégicas para o seu patrimônio e para a sua empresa.
            </p>
            <a href="#solucoes" className="bg-accent text-primary px-8 py-4 rounded font-bold uppercase tracking-wider hover:bg-white transition-all shadow-xl inline-block">
              Conheça Nossas Áreas
            </a>
          </motion.div>
        </div>
      </section>

      {/* Serviços */}
      <section id="solucoes" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeading title="Nossas Áreas de Atuação" subtitle="Atuação completa e especializada para demandas complexas." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Direito Civil e Família", img: "direito-civil-e-familia.png", desc: "Divórcios, guarda, pensão, regimes de bens e acordos pré-nupciais. Especialistas em Inventários, Partilhas e Testamentos." },
              { title: "Empresarial e Tributário", img: "empresarial-e-tributario.png", desc: "Planejamento tributário, recuperação de créditos, Holding Empresarial, Direito Societário e Falimentar." },
              { title: "Direito Imobiliário", img: "direito-imobiliario.png", desc: "Compra e venda, locação, usucapião, regularização fundiária, incorporações e administração de condomínios." },
              { title: "Trabalhista e Previdenciário", img: "trabalhista-e-previdenciario.png", desc: "Defesa de empresas e trabalhadores. Aposentadorias, BPC/LOAS, pensões e auxílios." },
              { title: "Administrativo e Eleitoral", img: "administrativo-e-eleitoral.png", desc: "Licitações, contratos públicos e atuação em Tribunais de Contas. Consultoria para candidatos." },
              { title: "Contratos e Consumidor", img: "contratos-e-consumidor.png", desc: "Elaboração e revisão contratual minuciosa. Defesa em relações de consumo, mediação e arbitragem." }
            ].map((service, idx) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={idx} 
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:border-accent"
              >
                <img 
                  src={service.img} 
                  alt={service.title} 
                  className="w-full h-48 object-cover" 
                  onError={(e) => e.currentTarget.src = `https://placehold.co/600x400/081f2e/c49a50?text=${service.title.replace(/\s/g, '+')}`} 
                />
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-secondary mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed">{service.desc}</p>
                  <a href="https://wa.me/5531985835742" className="inline-block bg-accent text-primary px-6 py-3 rounded text-center font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all">Saiba Mais</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <SectionHeading title="Sobre o Escritório" />
          <div className="flex flex-wrap lg:flex-nowrap gap-12 items-start justify-center">
            <div className="lg:w-1/2 text-gray-600 space-y-4 text-lg">
              <p>A <strong className="text-primary">Lopes & Lopes Advocacia e Consultoria</strong> oferece uma proposta de valor única no mercado: a integração técnica entre o Direito, a Contabilidade e o Mercado Imobiliário.</p>
              <p>Nossa missão é prestar serviços jurídicos de alta performance, protegendo o patrimônio e garantindo os direitos de nossos clientes através de uma atuação ética, transparente e inovadora.</p>
              <p>Com sede em Minas Gerais, atuamos com foco na resolução eficaz de conflitos, seja na esfera extrajudicial ou judicial.</p>
            </div>
            <div className="lg:w-1/3 bg-white p-8 rounded shadow-sm border-l-4 border-accent">
              <h3 className="text-2xl font-bold text-primary mb-6">Nossos Pilares</h3>
              <ul className="space-y-4">
                {[
                  { title: "Visão 360º", desc: "Análise jurídica, contábil e negocial." },
                  { title: "Excelência Técnica", desc: "Atualização constante e rigor acadêmico." },
                  { title: "Ética e Transparência", desc: "Relações de confiança duradouras." }
                ].map((pilar, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Check className="text-accent flex-shrink-0 mt-1" size={20} />
                    <div className="text-gray-700">
                      <strong className="block">{pilar.title}:</strong>
                      <span className="text-sm">{pilar.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Profissional */}
      <section id="equipe" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeading title="Perfil Profissional" />
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-2/5">
              <img 
                src="clecio-lopes-perfil.png" 
                alt="Dr. Clécio Lopes" 
                className="w-full h-full object-cover" 
                onError={(e) => e.currentTarget.src = ASSETS.clecio} 
              />
            </div>
            <div className="md:w-3/5 p-8 md:p-12">
              <h3 className="text-3xl font-bold text-primary mb-1">Clécio Lopes Patrocínio</h3>
              <h4 className="text-accent font-semibold mb-6">Sócio Fundador | OAB/MG 223.044</h4>
              
              <div className="space-y-6 text-gray-600">
                <div>
                  <h5 className="font-bold text-primary mb-2">Mestre em Direito:</h5>
                  <p className="text-sm">"Direito e Justiça" pela UFMG, com ênfase em Direito Tributário e Justiça Distributiva.</p>
                </div>
                <div>
                  <h5 className="font-bold text-primary mb-2">Tripla Graduação:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Direito (Doctum/MG)</li>
                    <li>Ciências Contábeis (Unifuncesi)</li>
                    <li>Negócios Imobiliários (Unicesumar)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-primary mb-2">Especializações (Pós-Graduação):</h5>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs list-disc list-inside">
                    <li>Direito Tributário</li>
                    <li>Direito Civil e Processo Civil</li>
                    <li>Direito de Família e Sucessões</li>
                    <li>Direito Imobiliário e Notarial</li>
                    <li>Compliance e Integridade Corporativa</li>
                    <li>Contabilidade Pública e Perícia</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testemunhos */}
      <section id="depoimentos" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <SectionHeading title="O Que Dizem Nossos Clientes" subtitle="A satisfação e a confiança de quem já contou com a nossa expertise jurídica." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.length > 0 ? (
              testimonials.map((t, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={t.id} 
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative hover:shadow-lg transition-all"
                >
                  <div className="absolute top-4 left-6 text-accent opacity-20 text-6xl font-serif">“</div>
                  <img 
                    src={t.avatar_url || 'https://placehold.co/100x100?text=Avatar'} 
                    alt={t.nome} 
                    className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-accent p-1" 
                  />
                  <h4 className="font-bold text-primary mb-2">{t.nome}</h4>
                  <div className="flex space-x-1 text-accent mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < t.estrelas ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-gray-600 italic text-sm leading-relaxed">"{t.texto}"</p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 italic py-10">
                Aguardando novos depoimentos...
              </div>
            )}
          </div>

          {/* Form de Depoimento */}
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-accent/20">
            <h3 className="text-2xl font-bold text-primary text-center mb-6">Deixe seu Depoimento</h3>
            {!user ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-6 italic">Conecte sua conta do Google para enviar uma avaliação.</p>
                <button 
                  onClick={loginGoogle}
                  className="bg-white border-2 border-primary text-primary px-8 py-3 rounded-full flex items-center justify-center space-x-3 mx-auto hover:bg-primary hover:text-white transition-all font-bold"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" className="w-5" />
                  <span>Entrar com Google</span>
                </button>
              </div>
            ) : (
              <form onSubmit={submitTestimonial} className="space-y-6">
                <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-100">
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full border border-accent" />
                  <div>
                    <p className="font-bold text-primary leading-none">{user.user_metadata.full_name}</p>
                    <button type="button" onClick={handleLogout} className="text-xs text-red-500 hover:underline">Sair</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Sua Avaliação</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        type="button" 
                        onClick={() => setRating(s)}
                        className={`p-1 transition-transform hover:scale-125 ${rating >= s ? 'text-accent' : 'text-gray-300'}`}
                      >
                        <Star size={32} fill={rating >= s ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Seu Depoimento</label>
                  <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    rows={4}
                    placeholder="Conte sua experiência com nosso escritório..."
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-accent text-primary font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Publicar Depoimento'}
                </button>
                <p className="text-[10px] text-gray-400 text-center uppercase italic">* Seu depoimento será postado após aprovação do administrador.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeading title="Artigos e Notícias" subtitle="Conteúdo jurídico atualizado para sua informação." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Holding Familiar: Proteção Patrimonial", img: "holding-familiar-protecao-patrimonial.png", desc: "Entenda como a criação de uma Holding pode proteger os bens da sua família." },
              { title: "Regularização de Imóveis e Usucapião", img: "regularizacao-imoveis-usucapiao.png", desc: "Seu imóvel não tem escritura? Saiba como a regularização fundiária valoriza o bem." },
              { title: "Planejamento Tributário Empresarial", img: "planejamento-tributario-empresarial.png", desc: "Como a elisão fiscal e a recuperação de créditos aumentam a lucratividade." }
            ].map((blog, idx) => (
              <div key={idx} className="bg-white rounded shadow-sm border group overflow-hidden">
                <img 
                  src={blog.img} 
                  alt={blog.title} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform" 
                  onError={(e) => e.currentTarget.src = `https://placehold.co/400x250/081f2e/c49a50?text=Blog+Artigo`} 
                />
                <div className="p-6">
                  <h3 className="font-bold text-primary mb-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{blog.desc}</p>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-accent font-bold text-xs uppercase flex items-center group">
                    Ler Artigo <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Endereço */}
      <section id="endereco" className="py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <SectionHeading title="Localização" />
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-primary mb-4">Nosso Escritório</h3>
            <p className="mb-8 text-gray-700">
              Rua João Camilo de Oliveira Torres, n. 21 - Sala 4<br />
              Bairro Juca Rosa, Itabira/MG
            </p>
            <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-accent shadow-xl mb-8">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3745.397858632617!2d-43.2307898!3d-19.6193796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa507567c000001%3A0x0!2sR.%20Jo%C3%A3o%20Camilo%20de%20Oliveira%20Torres%2C%2021%20-%20Juca%20Rosa%2C%20Itabira%20-%20MG%2C%2035900-246!5e0!3m2!1spt-BR!2sbr!4v1650000000000!5m2!1spt-BR!2sbr" 
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
              ></iframe>
            </div>
            <div className="bg-white p-6 rounded-lg inline-block shadow-sm">
              <h4 className="font-bold text-primary mb-2">Horário de Atendimento</h4>
              <p className="text-gray-600">Segunda a Sexta: 08:00h às 18:00h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <SectionHeading title="Fale Conosco" subtitle="Agende sua consultoria com quem entende do assunto." />
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { icon: <Phone size={32} />, title: "WhatsApp", info: "(31) 98583-5742", link: "https://wa.me/5531985835742" },
              { icon: <Mail size={32} />, title: "E-mail", info: "advocaciacleciolopes@gmail.com", link: "mailto:advocaciacleciolopes@gmail.com" },
              { icon: <Instagram size={32} />, title: "Instagram", info: "@advocaciacleciolopes", link: "https://www.instagram.com/advocaciacleciolopes" }
            ].map((c, i) => (
              <div key={i} className="bg-gray-50 p-10 rounded-xl border border-gray-100 w-full md:w-80 flex flex-col items-center hover:border-accent hover:shadow-xl transition-all">
                <div className="text-accent mb-6">{c.icon}</div>
                <h3 className="font-bold text-primary text-xl mb-2">{c.title}</h3>
                <p className="text-gray-600 mb-6">{c.info}</p>
                <a href={c.link} className="bg-accent text-primary px-6 py-2 rounded font-bold uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all">Contatar</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating WA */}
      <a 
        href="https://wa.me/5531985835742" 
        target="_blank" 
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform whatsapp-pulse"
      >
        <Phone size={32} />
      </a>
    </div>
  );
};

const AdminPage = () => {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [depoimentos, setDepoimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setAdminUser(session.user);
      fetchDepoimentos();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      alert('Acesso negado: Credenciais inválidas.');
    } else {
      setAdminUser(data.user);
      fetchDepoimentos();
    }
  };

  const fetchDepoimentos = async () => {
    const { data, error } = await supabase
      .from('depoimentos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setDepoimentos(data);
  };

  const deleteDepoimento = async (id: string) => {
    if (window.confirm('Excluir este depoimento?')) {
      await supabase.from('depoimentos').delete().eq('id', id);
      fetchDepoimentos();
    }
  };

  const toggleAprovar = async (id: string, current: boolean) => {
    await supabase.from('depoimentos').update({ aprovado: !current }).eq('id', id);
    fetchDepoimentos();
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <div className="text-center mb-8">
            <img 
              src="logo-lopes-&-lopes.png" 
              alt="Logo" 
              className="h-12 mx-auto mb-6" 
              onError={(e) => (e.currentTarget.src = ASSETS.logo)}
            />
            <h2 className="text-2xl font-bold text-primary">Área Administrativa</h2>
            <p className="text-gray-500 text-sm">Entre com suas credenciais de acesso</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3 border rounded focus:ring-2 focus:ring-accent outline-none"
                placeholder="admin@lopesadv.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Senha</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-3 border rounded focus:ring-2 focus:ring-accent outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent text-primary font-bold py-3 rounded hover:bg-primary hover:text-white transition-all"
            >
              {loading ? 'Acessando...' : 'Entrar no Painel'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const filteredDepoimentos = depoimentos.filter(d => activeTab === 'pending' ? !d.aprovado : d.aprovado);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-primary">Dashboard Administrativo</h2>
            <p className="text-gray-500">Gestão de Depoimentos e Conteúdo</p>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => setAdminUser(null))} 
            className="flex items-center space-x-2 bg-red-500 text-white px-6 py-2 rounded font-bold hover:bg-red-600 transition-all shadow-md"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-4 font-bold transition-all flex items-center justify-center space-x-2 ${activeTab === 'pending' ? 'bg-accent text-primary' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <Clock size={20} />
              <span>Pendentes ({depoimentos.filter(d => !d.aprovado).length})</span>
            </button>
            <button 
              onClick={() => setActiveTab('approved')}
              className={`flex-1 py-4 font-bold transition-all flex items-center justify-center space-x-2 ${activeTab === 'approved' ? 'bg-accent text-primary' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <CheckCircle size={20} />
              <span>Aprovados ({depoimentos.filter(d => d.aprovado).length})</span>
            </button>
          </div>

          <div className="p-8">
            {filteredDepoimentos.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Star size={48} className="mx-auto mb-4 opacity-20" />
                <p>Nenhum depoimento nesta categoria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-primary border-b uppercase text-xs font-bold tracking-widest">
                    <tr>
                      <th className="pb-4">Data</th>
                      <th className="pb-4">Cliente</th>
                      <th className="pb-4">Estrelas</th>
                      <th className="pb-4">Depoimento</th>
                      <th className="pb-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDepoimentos.map((d) => (
                      <tr key={d.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-6 text-xs text-gray-400 font-mono">
                          {new Date(d.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-6">
                          <div className="flex items-center space-x-3">
                            <img src={d.avatar_url} alt="" className="w-10 h-10 rounded-full border" />
                            <span className="font-bold text-primary">{d.nome}</span>
                          </div>
                        </td>
                        <td className="py-6">
                          <div className="flex text-accent">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < d.estrelas ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </td>
                        <td className="py-6 max-w-md">
                          <p className="text-gray-600 text-sm italic line-clamp-2">"{d.texto}"</p>
                        </td>
                        <td className="py-6 text-right">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => toggleAprovar(d.id, d.aprovado)}
                              className={`p-2 rounded transition-all ${d.aprovado ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                              title={d.aprovado ? "Remover Aprovação" : "Aprovar"}
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => deleteDepoimento(d.id)}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-all"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LegalPage = ({ title, content }: { title: string, content: React.ReactNode }) => (
  <div className="pt-32 pb-24 px-6 bg-white min-h-screen">
    <div className="container mx-auto max-w-4xl">
      <SectionHeading title={title} />
      <div className="prose prose-lg prose-primary mx-auto text-gray-700 leading-relaxed space-y-6">
        {content}
      </div>
    </div>
  </div>
);

// --- App Root ---

const App = () => {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/termos" element={<LegalPage title="Termos e Condições de Uso" content={(
          <>
            <p>Bem-vindo ao portal digital da <strong>Lopes & Lopes Advocacia</strong>. A seguir, apresentamos os Termos de Uso que regem a navegação e a utilização dos serviços disponibilizados neste site.</p>
            <h2 className="text-2xl font-bold mt-8">1. Aceitação dos Termos</h2>
            <p>Ao acessar e navegar por este site, o usuário declara ter lido, compreendido e aceito integralmente os presentes Termos de Uso e a nossa Política de Privacidade.</p>
            <h2 className="text-2xl font-bold mt-8">2. Natureza Informativa</h2>
            <p>Todo o conteúdo disponibilizado possui caráter exclusivamente informativo e educacional. Nenhuma informação aqui publicada constitui consultoria jurídica formal ou estabelece relação advogado-cliente.</p>
          </>
        )} />} />
        <Route path="/privacidade" element={<LegalPage title="Política de Privacidade" content={(
          <>
            <p>A <strong>Lopes & Lopes Advocacia e Consultoria</strong> reafirma seu compromisso com a segurança, privacidade e transparência no tratamento de suas informações, em conformidade com a <strong>LGPD</strong>.</p>
            <h2 className="text-2xl font-bold mt-8">1. Coleta de Dados</h2>
            <p>Coletamos dados mínimos para atendimento, como nome, e-mail e telefone fornecidos voluntariamente via WhatsApp ou formulários.</p>
            <h2 className="text-2xl font-bold mt-8">2. Finalidade</h2>
            <p>Seus dados são tratados para responder dúvidas jurídicas, agendar consultas e garantir a segurança do site.</p>
          </>
        )} />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
