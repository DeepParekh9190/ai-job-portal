# 🎨 Component Templates Guide

This document provides templates for all remaining components needed to complete the AI Job Portal frontend.

---

## 📁 Component Structure

```
client/src/components/
├── common/              # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   ├── Loader.jsx
│   └── Toast.jsx
│
├── layout/              # Layout components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── Sidebar.jsx
│
└── features/            # Feature-specific components
    ├── JobCard.jsx
    ├── ApplicationCard.jsx
    ├── ResumePreview.jsx
    ├── MatchScore.jsx
    └── DataTable.jsx
```

---

## 🧩 Common Components

### Button.jsx Template

```jsx
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-danger'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Input.jsx Template

```jsx
const Input = ({ 
  label, 
  error, 
  type = 'text', 
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && <label className="form-label">{label}</label>}
      <input
        type={type}
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default Input;
```

### Card.jsx Template

```jsx
const Card = ({ children, hover = false, className = '' }) => {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
```

### Modal.jsx Template

```jsx
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className={`modal-content ${sizeClasses[size]} w-full p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </>
  );
};

export default Modal;
```

### Loader.jsx Template

```jsx
const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const loader = (
    <div className={`loading-spinner ${sizeClasses[size]}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
```

---

## 🏗️ Layout Components

### Navbar.jsx Template

```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            AI Job Portal
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="hover:text-primary-600">Jobs</Link>
            <Link to="/gigs" className="hover:text-primary-600">Gigs</Link>
            
            {isAuthenticated ? (
              <>
                <Link to={`/${user.role}/dashboard`} className="hover:text-primary-600">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-600">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            {/* Add mobile menu items */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```

### Footer.jsx Template

```jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AI Job Portal</h3>
            <p className="text-gray-400">
              Find your dream job with AI-powered matching
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</Link></li>
              <li><Link to="/user/resume-builder" className="text-gray-400 hover:text-white">Resume Builder</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2">
              <li><Link to="/client/post-job" className="text-gray-400 hover:text-white">Post a Job</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AI Job Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

---

## 🎯 Feature Components

### JobCard.jsx Template

```jsx
import { MapPin, Briefcase, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatSalary, getRelativeTime } from '../../utils/helpers';

const JobCard = ({ job }) => {
  return (
    <Link to={`/jobs/${job._id}`} className="card card-hover">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
          <p className="text-gray-600">{job.client?.company?.name || 'Company'}</p>
        </div>
        {job.isFeatured && (
          <span className="badge badge-primary">Featured</span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} />
          <span>{job.location?.city || 'Remote'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase size={16} />
          <span>{job.jobType}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign size={16} />
          <span>{formatSalary(job.salary?.min, job.salary?.max)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.requirements?.skills?.slice(0, 3).map((skill, index) => (
          <span key={index} className="badge badge-gray">{skill}</span>
        ))}
      </div>

      <p className="text-sm text-gray-500">Posted {getRelativeTime(job.createdAt)}</p>
    </Link>
  );
};

export default JobCard;
```

### MatchScore.jsx Template

```jsx
import { getMatchScoreColor } from '../../utils/helpers';

const MatchScore = ({ score, breakdown }) => {
  return (
    <div className="card">
      <div className="text-center mb-6">
        <div className={`text-6xl font-bold ${getMatchScoreColor(score)}`}>
          {score}%
        </div>
        <p className="text-gray-600 mt-2">Match Score</p>
      </div>

      {breakdown && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Skills Match</span>
              <span className="font-semibold">{breakdown.skills?.score}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${breakdown.skills?.score}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Experience Match</span>
              <span className="font-semibold">{breakdown.experience?.score}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${breakdown.experience?.score}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScore;
```

---

## 📄 Page Templates

### Basic Page Template

```jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/common/Loader';

const PageName = () => {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.slice);
  const [state, setState] = useState(null);

  useEffect(() => {
    // Fetch data on mount
    // dispatch(fetchAction());
  }, [dispatch]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="section-title">Page Title</h1>
      {/* Page content */}
    </div>
  );
};

export default PageName;
```

---

## 📝 Form Template

```jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { validateForm, VALIDATION_RULES } from '../utils/validation';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const FormPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    field1: '',
    field2: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, {
      field1: VALIDATION_RULES.name,
      field2: VALIDATION_RULES.email
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      // await dispatch(submitAction(formData)).unwrap();
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto">
        <h1 className="section-title text-center">Form Title</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Field 1"
            name="field1"
            value={formData.field1}
            onChange={handleChange}
            error={errors.field1}
            required
          />

          <Input
            label="Field 2"
            name="field2"
            type="email"
            value={formData.field2}
            onChange={handleChange}
            error={errors.field2}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
```

---

## 🎯 Implementation Checklist

### Common Components (6)
- [ ] Button.jsx
- [ ] Input.jsx
- [ ] Card.jsx
- [ ] Modal.jsx
- [ ] Loader.jsx
- [ ] Toast.jsx (already handled by react-hot-toast)

### Layout Components (3)
- [ ] Navbar.jsx
- [ ] Footer.jsx
- [ ] Sidebar.jsx

### Feature Components (5)
- [ ] JobCard.jsx
- [ ] ApplicationCard.jsx
- [ ] ResumePreview.jsx
- [ ] MatchScore.jsx
- [ ] DataTable.jsx

### Pages - Auth (3)
- [ ] Login.jsx
- [ ] Register.jsx
- [ ] Home.jsx

### Pages - User (8)
- [ ] Dashboard.jsx
- [ ] BrowseJobs.jsx
- [ ] BrowseGigs.jsx
- [ ] JobDetails.jsx
- [ ] ApplyJob.jsx
- [ ] MyApplications.jsx
- [ ] ResumeBuilder.jsx
- [ ] ResumeAnalyzer.jsx

### Pages - Client (6)
- [ ] Dashboard.jsx
- [ ] PostJob.jsx
- [ ] PostGig.jsx
- [ ] MyJobs.jsx
- [ ] MyGigs.jsx
- [ ] Applicants.jsx

### Pages - Admin (5)
- [ ] Dashboard.jsx
- [ ] ManageUsers.jsx
- [ ] ManageClients.jsx
- [ ] ApproveJobs.jsx
- [ ] Analytics.jsx

---

## 🚀 Quick Start Guide

1. **Copy template code** for each component
2. **Customize** according to your needs
3. **Import required dependencies**
4. **Connect to Redux** where needed
5. **Test functionality**
6. **Add styling** with Tailwind classes

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Router](https://reactrouter.com/)

---

**Note:** These are templates to get you started. Customize them based on your specific requirements!