
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Database, 
  Zap, 
  CheckCircle, 
  Globe, 
  Lock, 
  BarChart3, 
  Cpu,
  Network,
  FileText,
  Award,
  TrendingUp
} from 'lucide-react';

const Methodology = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Methodology & Data Sources
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transparent, science-based carbon accounting methodology built on industry standards 
          and cutting-edge technology for accurate, verifiable emissions tracking.
        </p>
        <div className="flex justify-center gap-2 mt-6">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            ISO 14064 Compliant
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            GHG Protocol
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Third-Party Verified
          </Badge>
        </div>
      </div>

      {/* Methodology Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-green-600" />
            Carbon Accounting Methodology
          </CardTitle>
          <CardDescription>
            Our methodology follows international standards and best practices for greenhouse gas accounting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">GHG Protocol Compliance</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Scope 1: Direct emissions from owned/controlled sources</li>
                <li>• Scope 2: Indirect emissions from purchased energy</li>
                <li>• Scope 3: All other indirect emissions in value chain</li>
                <li>• Activity-based calculations with emission factors</li>
                <li>• Uncertainty quantification and confidence intervals</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Science-Based Targets</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• SBTi-approved target setting methodology</li>
                <li>• 1.5°C pathway alignment</li>
                <li>• Sector-specific decarbonization pathways</li>
                <li>• Annual target validation and progress tracking</li>
                <li>• Scenario analysis and modeling</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Calculation Methodologies</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Energy Consumption</h4>
                <p className="text-sm text-gray-600">
                  Grid emission factors, renewable energy certificates, and consumption-based allocation
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Transportation</h4>
                <p className="text-sm text-gray-600">
                  Fuel consumption, vehicle efficiency, and distance-based calculations
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Supply Chain</h4>
                <p className="text-sm text-gray-600">
                  Spend-based, activity-based, and hybrid approaches with supplier engagement
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            Data Sources & Collection
          </CardTitle>
          <CardDescription>
            Multi-source data collection with real-time integration and quality assurance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Primary Data Collection</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Direct meter readings and IoT sensors</li>
                <li>• Utility bills and energy consumption data</li>
                <li>• Fuel consumption and vehicle telematics</li>
                <li>• Waste management and disposal records</li>
                <li>• Employee travel and commuting data</li>
                <li>• Procurement and spend data</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Secondary Data Sources</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• EPA emission factors database</li>
                <li>• IPCC guidelines and methodologies</li>
                <li>• Industry-specific emission factors</li>
                <li>• Regional grid emission factors</li>
                <li>• Supplier sustainability reports</li>
                <li>• Public environmental databases</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Third-Party Data Providers</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Environmental Data</h4>
                <p className="text-sm text-gray-600">
                  Integration with leading environmental data providers for comprehensive coverage
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Financial Data</h4>
                <p className="text-sm text-gray-600">
                  Spend-based calculations using financial data from ERP systems
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Market Intelligence</h4>
                <p className="text-sm text-gray-600">
                  Industry benchmarks and peer comparison data for context
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Implementation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-purple-600" />
            Technical Implementation
          </CardTitle>
          <CardDescription>
            Advanced technology stack ensuring data integrity, security, and real-time processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">API Integrations</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• RESTful APIs for real-time data ingestion</li>
                <li>• Webhook support for automated updates</li>
                <li>• OAuth 2.0 authentication and security</li>
                <li>• Rate limiting and data validation</li>
                <li>• Error handling and retry mechanisms</li>
                <li>• Data transformation and normalization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">AI & Machine Learning</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Anomaly detection in emission data</li>
                <li>• Predictive modeling for emissions forecasting</li>
                <li>• Natural language processing for data extraction</li>
                <li>• Automated categorization and classification</li>
                <li>• Pattern recognition for optimization opportunities</li>
                <li>• Continuous learning and model improvement</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Network className="h-4 w-4" />
                Blockchain Transparency
              </h4>
              <p className="text-sm text-gray-600">
                Immutable audit trails and data provenance using distributed ledger technology
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Cloud Infrastructure
              </h4>
              <p className="text-sm text-gray-600">
                Scalable, secure cloud architecture with global data centers and redundancy
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Security & Privacy
              </h4>
              <p className="text-sm text-gray-600">
                SOC 2 Type II compliance, GDPR adherence, and enterprise-grade security
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Assurance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Quality Assurance & Verification
          </CardTitle>
          <CardDescription>
            Multi-layered quality assurance processes ensuring data accuracy and reliability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Data Quality Assurance</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Automated data validation and consistency checks</li>
                <li>• Outlier detection and anomaly flagging</li>
                <li>• Data completeness and accuracy verification</li>
                <li>• Cross-reference validation with multiple sources</li>
                <li>• Real-time quality scoring and monitoring</li>
                <li>• Automated data correction and enhancement</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Third-Party Verification</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Annual third-party audits by certified verifiers</li>
                <li>• ISO 14064-3 compliant verification process</li>
                <li>• Independent data quality assessments</li>
                <li>• Methodology review and validation</li>
                <li>• Stakeholder assurance and confidence building</li>
                <li>• Public verification statements and reports</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Audit Trails & Data Lineage</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Data Lineage</h4>
                <p className="text-sm text-gray-600">
                  Complete traceability from source to final calculation with version control
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Change Tracking</h4>
                <p className="text-sm text-gray-600">
                  Immutable audit logs of all data modifications and calculation changes
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Compliance Reporting</h4>
                <p className="text-sm text-gray-600">
                  Automated generation of compliance reports and audit documentation
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Standards */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-gold-600" />
            Compliance & Standards
          </CardTitle>
          <CardDescription>
            Adherence to international standards and regulatory requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Regulatory Compliance</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• SEC climate disclosure requirements</li>
                <li>• EU Taxonomy and CSRD compliance</li>
                <li>• TCFD framework implementation</li>
                <li>• California SB 253 and SB 261</li>
                <li>• International sustainability standards</li>
                <li>• Regional carbon reporting requirements</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Industry Standards</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• ISO 14064-1:2018 greenhouse gas accounting</li>
                <li>• GHG Protocol Corporate Standard</li>
                <li>• Science Based Targets initiative (SBTi)</li>
                <li>• CDP reporting framework</li>
                <li>• GRI sustainability reporting standards</li>
                <li>• SASB industry-specific standards</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Certifications & Validations</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">ISO Certifications</h4>
                <p className="text-sm text-gray-600">
                  ISO 14064, ISO 14001, and ISO 27001 certifications for quality and security
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Third-Party Validations</h4>
                <p className="text-sm text-gray-600">
                  Independent validation by recognized environmental verification bodies
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Industry Recognition</h4>
                <p className="text-sm text-gray-600">
                  Awards and recognition from sustainability and technology organizations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continuous Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Continuous Improvement & Updates
          </CardTitle>
          <CardDescription>
            Ongoing methodology refinement and technology advancement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Methodology Updates</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Quarterly methodology reviews and updates</li>
                <li>• Integration of latest scientific research</li>
                <li>• Adoption of new emission factors and standards</li>
                <li>• Stakeholder feedback incorporation</li>
                <li>• Industry best practice adoption</li>
                <li>• Regulatory change monitoring and implementation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Technology Enhancement</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Continuous AI/ML model improvement</li>
                <li>• New data source integration</li>
                <li>• Enhanced security and privacy features</li>
                <li>• Performance optimization and scalability</li>
                <li>• User experience improvements</li>
                <li>• API enhancements and new integrations</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Transparency Commitment</h3>
            <p className="text-gray-700">
              We are committed to full transparency in our methodology and data sources. 
              All calculations, emission factors, and data sources are documented and 
              available for review. We welcome feedback and collaboration to continuously 
              improve our carbon accounting capabilities and contribute to global climate action.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-600">
        <p className="mb-2">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <p className="text-sm">
          For questions about our methodology or data sources, please contact our technical team.
        </p>
      </div>
    </div>
  );
};

export default Methodology;
