import {Link }from 'react-router-dom';
import './ProfileBuilderNew.css';
const services = [
  {
    id: 'linkedin',
    title: 'LinkedIn Profile Optimization',
    subtitle: 'For Recruiters & Networking',
    description: 'Position your LinkedIn presence so hiring managers quickly understand your capabilities and target roles.',
  },
  {
    id: 'naukri',
    title: 'Naukri.com Profile Enhancement',
    subtitle: 'For Indian Hiring Platforms',
    description: 'Configure your profile to rank higher in recruiter searches and attract relevant opportunities.',
  },
  {
    id: 'resume',
    title: 'Professional Resume Development',
    subtitle: 'For Impactful First Impressions',
    description: 'Create ATS-compliant resumes that highlight your strengths and accelerate hiring decisions.',
  },
  {
    id: 'github',
    title: 'GitHub Profile Positioning',
    subtitle: 'For Software & Tech Roles',
    description: 'Curate your GitHub as a professional portfolio demonstrating code quality and technical depth.',
  },
  {
    id: 'portfolio',
    title: 'Portfolio Website Creation',
    subtitle: 'For Project Showcasing',
    description: 'Build a modern personal website presenting your projects and professional narrative.',
  },
  {
    id: 'cover-letter',
    title: 'Targeted Cover Letter Development',
    subtitle: 'For Personalized Applications',
    description: 'Craft tailored cover letters connecting your background to specific roles and organizations.',
  },
];
const ProfileBuilderNew = () => {
  return (
    <div className="services-section">
        <div className="services-grid">
          {services.map((service, index) => (
            <Link 
              key={service.id} 
              to={`/${service.id}`}
              className="service-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-header">
                <span className="service-badge">{service.subtitle}</span>
                <div className="card-icon">→</div>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
  )
}

export default ProfileBuilderNew