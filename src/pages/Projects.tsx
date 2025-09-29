import { useState } from 'react';
import { ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const PROJECTS = [
  {
    id: 1,
    title: "AI-Powered Analytics Dashboard",
    description: "A comprehensive analytics platform using machine learning to provide actionable business insights with real-time data processing.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    technologies: ["React", "Python", "TensorFlow", "PostgreSQL", "Docker"],
    category: "AI & Machine Learning",
    status: "Completed",
    date: "2024",
    featured: true,
    links: {
      demo: "#",
      github: "#"
    }
  },
  {
    id: 2,
    title: "Microservices E-commerce Platform",
    description: "Scalable e-commerce solution built with microservices architecture, supporting millions of concurrent users.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    technologies: ["Node.js", "Kubernetes", "MongoDB", "Redis", "GraphQL"],
    category: "Backend & Infrastructure",
    status: "Completed",
    date: "2023",
    featured: true,
    links: {
      demo: "#",
      github: "#"
    }
  },
  {
    id: 3,
    title: "Real-time Collaboration Tool",
    description: "WebRTC-based collaboration platform enabling seamless real-time communication and document sharing.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
    technologies: ["Vue.js", "WebRTC", "Socket.io", "Node.js", "AWS"],
    category: "Frontend & UI/UX",
    status: "In Progress",
    date: "2024",
    featured: false,
    links: {
      demo: "#",
      github: "#"
    }
  },
  {
    id: 4,
    title: "Blockchain Supply Chain Tracker",
    description: "Ethereum-based supply chain management system ensuring transparency and traceability.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
    technologies: ["Solidity", "Web3.js", "React", "IPFS", "Ethereum"],
    category: "Blockchain & Web3",
    status: "Completed",
    date: "2023",
    featured: false,
    links: {
      demo: "#",
      github: "#"
    }
  },
  {
    id: 5,
    title: "IoT Device Management System",
    description: "Comprehensive IoT platform for monitoring and managing thousands of connected devices.",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&h=400&fit=crop",
    technologies: ["Python", "MQTT", "InfluxDB", "Grafana", "Docker"],
    category: "IoT & Hardware",
    status: "Completed",
    date: "2023",
    featured: false,
    links: {
      demo: "#",
      github: "#"
    }
  },
  {
    id: 6,
    title: "Mobile-First PWA Framework",
    description: "Custom progressive web app framework optimized for mobile performance and offline functionality.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    technologies: ["TypeScript", "Service Workers", "IndexedDB", "Webpack"],
    category: "Mobile & PWA",
    status: "In Progress",
    date: "2024",
    featured: false,
    links: {
      demo: "#",
      github: "#"
    }
  }
];

const CATEGORIES = ["All", "AI & Machine Learning", "Backend & Infrastructure", "Frontend & UI/UX", "Blockchain & Web3", "IoT & Hardware", "Mobile & PWA"];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredProjects = PROJECTS.filter(project => {
    const categoryMatch = selectedCategory === "All" || project.category === selectedCategory;
    const statusMatch = selectedStatus === "All" || project.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const featuredProjects = filteredProjects.filter(project => project.featured);
  const regularProjects = filteredProjects.filter(project => !project.featured);

  return (
    <div className="min-h-screen bg-primary-dark">
      <Header />
      
      {/* Hero Section */}
      <section className="section-spacing pt-32">
        <div className="container-axis">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="h1">Our Projects</h1>
            <p className="body-text max-w-2xl mx-auto">
              Explore our portfolio of cutting-edge projects spanning AI, blockchain, 
              IoT, and modern web applications. Each project showcases innovation and technical excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="section-spacing-sm">
        <div className="container-axis">
          <div className="space-y-8">
            {/* Category Filter */}
            <div>
              <h3 className="h3 mb-6 text-center">Filter by Category</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-accent-primary text-white'
                        : 'bg-card-dark text-text-muted hover:bg-secondary-dark hover:text-accent-hover'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="h3 mb-6 text-center">Filter by Status</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                {["All", "Completed", "In Progress"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      selectedStatus === status
                        ? 'bg-accent-primary text-white'
                        : 'bg-card-dark text-text-muted hover:bg-secondary-dark hover:text-accent-hover'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="section-spacing">
          <div className="container-axis">
            <h2 className="h2 text-center mb-12">Featured Projects</h2>
            <div className="grid-responsive cols-2">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-card-dark overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-accent-primary text-white text-xs font-medium">
                        FEATURED
                      </span>
                      <div className="flex items-center gap-2 text-text-body text-sm">
                        <Calendar size={16} />
                        <span>{project.date}</span>
                      </div>
                    </div>
                    
                    <h3 className="h2 group-hover:text-accent-hover transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="body-text">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-2 text-text-body text-sm">
                      <Tag size={16} />
                      <span>{project.category}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-secondary-dark text-text-muted text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-3 py-1 bg-secondary-dark text-text-muted text-xs">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <a
                        href={project.links.demo}
                        className="flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
                      >
                        <ExternalLink size={16} />
                        <span>Live Demo</span>
                      </a>
                      <a
                        href={project.links.github}
                        className="flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
                      >
                        <Github size={16} />
                        <span>Source Code</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Projects Grid */}
      {regularProjects.length > 0 && (
        <section className="section-spacing">
          <div className="container-axis">
            <h2 className="h2 text-center mb-12">All Projects</h2>
            <div className="grid-responsive cols-3">
              {regularProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-card-dark overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 text-xs font-medium ${
                        project.status === 'Completed' 
                          ? 'bg-green-900/30 text-green-300' 
                          : 'bg-blue-900/30 text-blue-300'
                      }`}>
                        {project.status}
                      </span>
                      <div className="flex items-center gap-2 text-text-body text-sm">
                        <Calendar size={14} />
                        <span>{project.date}</span>
                      </div>
                    </div>
                    
                    <h3 className="h3 group-hover:text-accent-hover transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="body-text text-sm">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-2 text-text-body text-sm">
                      <Tag size={14} />
                      <span className="text-xs">{project.category}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-secondary-dark text-text-muted text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-secondary-dark text-text-muted text-xs">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <a
                        href={project.links.demo}
                        className="flex items-center gap-1 text-accent-primary hover:text-accent-hover transition-colors text-sm"
                      >
                        <ExternalLink size={14} />
                        <span>Demo</span>
                      </a>
                      <a
                        href={project.links.github}
                        className="flex items-center gap-1 text-accent-primary hover:text-accent-hover transition-colors text-sm"
                      >
                        <Github size={14} />
                        <span>Code</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-secondary-dark">
        <div className="container-axis">
          <div className="text-center space-y-6">
            <h2 className="h2">Have a Project in Mind?</h2>
            <p className="body-text max-w-2xl mx-auto">
              Let's collaborate to bring your innovative ideas to life. 
              Our team is ready to tackle complex challenges and deliver exceptional results.
            </p>
            <button className="btn-primary">
              Start Your Project
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;