import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FormContainer = styled(motion.form)`
  max-width: 600px;
  margin: 4rem auto;
  padding: 3rem;
  background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
  border: 1px solid #333;
  border-radius: 8px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #FF6B35, #66FCF1);
  }
`;

const FormTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  color: #66FCF1;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #999;
  display: block;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
  border-radius: 4px;
  color: #EAEAEA;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #66FCF1;
    box-shadow: 0 0 0 2px rgba(102, 252, 241, 0.2);
  }
  
  &::placeholder {
    color: #555;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
  border-radius: 4px;
  color: #EAEAEA;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #66FCF1;
    box-shadow: 0 0 0 2px rgba(102, 252, 241, 0.2);
  }
  
  &::placeholder {
    color: #555;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #FF6B35, #E85A28);
  border: none;
  border-radius: 4px;
  color: #FFF;
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #FF6B35;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(102, 252, 241, 0.1);
  border: 1px solid #66FCF1;
  padding: 1.5rem;
  border-radius: 4px;
  color: #66FCF1;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin-top: 1rem;
`;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    return newErrors;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Web3Forms - Get your access key at https://web3forms.com
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_key: '7d08d914-5fb7-4cc5-8fa6-c68d8a5bf014', // Get from https://web3forms.com
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });
      
      if (response.ok) {
        console.log('Form submitted successfully:', formData);
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
    >
      <FormTitle>Get In Touch</FormTitle>
      
      <FormGroup>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          aria-required="true"
          aria-invalid={!!errors.name}
        />
        {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          aria-required="true"
          aria-invalid={!!errors.email}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="subject">Subject</Label>
        <Input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Project inquiry, collaboration, etc."
          aria-required="true"
          aria-invalid={!!errors.subject}
        />
        {errors.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="message">Message</Label>
        <TextArea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me about your project or idea..."
          aria-required="true"
          aria-invalid={!!errors.message}
        />
        {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
      </FormGroup>
      
      <SubmitButton
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
      </SubmitButton>
      
      {isSuccess && (
        <SuccessMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          ✓ Message sent successfully! I'll get back to you soon.
        </SuccessMessage>
      )}
    </FormContainer>
  );
};

export default ContactForm;
