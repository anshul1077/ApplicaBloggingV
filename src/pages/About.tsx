import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, BookOpen, Target, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-subtle-gradient py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            About BlogBuddy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're passionate about sharing knowledge and helping developers grow their skills through 
            high-quality content, practical tutorials, and insights from the tech community.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center shadow-card">
              <CardContent className="pt-8">
                <div className="bg-hero-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">Knowledge Sharing</h3>
                <p className="text-muted-foreground">
                  We believe in the power of sharing knowledge to help the developer community grow and thrive.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card">
              <CardContent className="pt-8">
                <div className="bg-hero-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">Community First</h3>
                <p className="text-muted-foreground">
                  Our content is created by developers, for developers, with real-world experience and practical insights.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card">
              <CardContent className="pt-8">
                <div className="bg-hero-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">Quality Focus</h3>
                <p className="text-muted-foreground">
                  Every article is carefully crafted to provide actionable insights and practical solutions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Our Story */}
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="mb-6">
                BlogBuddy was born from a simple idea: create a space where developers can share their 
                experiences, learn from each other, and stay updated with the latest trends in technology.
              </p>
              <p className="mb-6">
                What started as a small collection of tutorials has grown into a comprehensive resource 
                covering web development, programming best practices, emerging technologies, and industry insights.
              </p>
              <p className="mb-8">
                Our team of experienced developers and tech enthusiasts is committed to providing content 
                that not only informs but also inspires and empowers the next generation of developers.
              </p>
            </div>
            
            <Button asChild size="lg" className="bg-hero-gradient">
              <Link to="/blog" className="flex items-center space-x-2">
                <span>Start Reading</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Topics We Cover */}
      <section className="py-16 px-4 bg-accent/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-8">Topics We Cover</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              "React & JavaScript",
              "TypeScript",
              "CSS & Design",
              "API Development",
              "Web Performance",
              "Best Practices",
              "Emerging Tech",
              "Career Advice"
            ].map((topic) => (
              <div key={topic} className="bg-background p-4 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-primary">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;