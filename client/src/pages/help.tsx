import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, HelpCircle, Mail } from "lucide-react";
import { Link } from "wouter";

export default function Help() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours",
      });
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  const faqs = [
    {
      question: "How does pricing work?",
      answer: "Pricing is based on three factors: the base price of the software, your chosen CPU/Memory tier (Low 1x, Medium 1.5x, High 2.5x), and the number of active hours you purchase. For example, a software with a $10/hour base price on Medium tier for 10 hours would cost $150.",
    },
    {
      question: "What are active hours vs retention hours?",
      answer: "Active hours are the hours your application can run. Retention hours (24x your active hours) determine how long your app data is kept after your active hours are used up. This gives you time to purchase more hours without losing your work.",
    },
    {
      question: "Can I pause my apps?",
      answer: "Yes! You can pause any running app from your dashboard. Paused apps don't consume active hours, allowing you to save your purchased time for when you actually need it.",
    },
    {
      question: "What tier should I choose?",
      answer: "Low tier is suitable for light tasks and testing. Medium tier works for most professional workloads. High tier provides maximum performance for intensive operations like 3D rendering, large dataset analysis, or video editing.",
    },
    {
      question: "How do I launch an app?",
      answer: "From your dashboard, click the 'Launch' button on any purchased app. This will open the workspace where you can use the application. Make sure you have remaining active hours before launching.",
    },
    {
      question: "Can I delete an app?",
      answer: "Yes, you can remove apps from your dashboard at any time using the delete button. Please note that this action is permanent and will remove all associated data.",
    },
    {
      question: "What happens when my hours run out?",
      answer: "When your active hours are depleted, the app will be automatically paused. Your data will be retained for the retention period (24x your purchased hours), giving you time to purchase more hours and resume work.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, all data is encrypted in transit and at rest. Each user's apps run in isolated environments to ensure security and privacy.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pb-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-600/10" />
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      
      {/* Content */}
      <div className="relative z-10 px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" data-testid="link-dashboard">
                <Button variant="outline" className="rounded-full bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/10" data-testid="button-back">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Help & Documentation
                </h1>
                <p className="text-white/70 text-sm">Get answers and support</p>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* FAQs */}
          <GlassCard>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <HelpCircle className="h-6 w-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
              </div>
              <p className="text-white/70">Find answers to common questions</p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-6"
                  data-testid={`accordion-faq-${index}`}
                >
                  <AccordionTrigger className="text-white hover:text-cyan-400 text-left font-semibold py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCard>
          
          {/* Contact Form */}
          <GlassCard>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="h-6 w-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Contact Support</h2>
              </div>
              <p className="text-white/70">Send us a message and we'll get back to you</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border-white/30 text-white placeholder:text-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                  placeholder="your@email.com"
                  required
                  data-testid="input-email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white/80 font-medium">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border-white/30 text-white placeholder:text-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                  placeholder="How can we help?"
                  required
                  data-testid="input-subject"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white/80 font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border-white/30 text-white placeholder:text-white/40 focus:border-cyan-400 focus:ring-cyan-400/20 min-h-[150px]"
                  placeholder="Describe your issue or question..."
                  required
                  data-testid="input-message"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full rounded-full py-6 text-base font-semibold bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 shadow-lg shadow-purple-500/50 border-0"
                disabled={isSubmitting}
                data-testid="button-submit"
              >
                {isSubmitting ? "Sending..." : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </GlassCard>
          
          {/* Documentation Links */}
          <GlassCard>
            <h2 className="text-2xl font-bold text-white mb-4">Documentation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Getting Started</h3>
                <p className="text-white/70 text-sm mb-3">Learn the basics of using EmpowerSoft</p>
                <Button variant="outline" size="sm" className="rounded-full bg-white/5 border-white/30 text-white hover:bg-white/10" data-testid="button-docs-getting-started">
                  View Guide
                </Button>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">API Documentation</h3>
                <p className="text-white/70 text-sm mb-3">Integrate with our platform</p>
                <Button variant="outline" size="sm" className="rounded-full bg-white/5 border-white/30 text-white hover:bg-white/10" data-testid="button-docs-api">
                  View Docs
                </Button>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Pricing Guide</h3>
                <p className="text-white/70 text-sm mb-3">Understand our pricing model</p>
                <Button variant="outline" size="sm" className="rounded-full bg-white/5 border-white/30 text-white hover:bg-white/10" data-testid="button-docs-pricing">
                  Learn More
                </Button>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Best Practices</h3>
                <p className="text-white/70 text-sm mb-3">Optimize your usage</p>
                <Button variant="outline" size="sm" className="rounded-full bg-white/5 border-white/30 text-white hover:bg-white/10" data-testid="button-docs-best-practices">
                  Read Tips
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
