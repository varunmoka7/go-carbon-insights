import { IndustryCard, Industry } from './IndustryCard';

interface GridViewProps {
  industries: Industry[];
  getArchetypeBadgeVariant: (archetype: string) => "default" | "secondary" | "destructive" | "outline";
}

export const GridView = ({ industries, getArchetypeBadgeVariant }: GridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {industries.map((industry) => (
        <IndustryCard 
          key={industry.id} 
          industry={industry} 
          getArchetypeBadgeVariant={getArchetypeBadgeVariant}
        />
      ))}
    </div>
  );
};