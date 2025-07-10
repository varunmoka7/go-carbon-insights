import { InteractiveKPIDashboard } from './InteractiveKPIDashboard';

interface IndustryGlossaryHeaderProps {
  stats: {
    total: number;
    sectors: number;
    archetypes: number;
  };
  taxonomyData: any[];
}

export const IndustryGlossaryHeader = ({ stats, taxonomyData }: IndustryGlossaryHeaderProps) => {
  return (
    <div className="border-b bg-muted/30">
      <div className="container mx-auto px-6 pt-6 pb-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Industry Glossary</h1>
            <p className="text-sm leading-snug text-muted-foreground max-w-2xl">
              Explore our ESG-classified industry universe with aligned emissions archetypes, protocol mappings, and net-zero pathways.
            </p>
          </div>

          {/* Interactive KPI Dashboard */}
          <InteractiveKPIDashboard 
            stats={stats} 
            taxonomyData={taxonomyData}
          />
        </div>
      </div>
    </div>
  );
};