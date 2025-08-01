import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Company } from '@/types/company';

interface CompanyIdentifiersProps {
  company: Company;
  variant?: 'compact' | 'detailed';
  showActions?: boolean;
}

const CompanyIdentifiers: React.FC<CompanyIdentifiersProps> = ({ 
  company, 
  variant = 'compact',
  showActions = false 
}) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getExchangeUrl = (ticker: string, exchange: string) => {
    const exchangeUrls: Record<string, (ticker: string) => string> = {
      'NYSE': (t) => `https://www.nyse.com/quote/XNYS:${t}`,
      'NASDAQ': (t) => `https://www.nasdaq.com/market-activity/stocks/${t.toLowerCase()}`,
      'LSE': (t) => `https://www.londonstockexchange.com/stock/${t}`,
      'TSE': (t) => `https://www.jpx.co.jp/english/`,
    };
    
    return exchangeUrls[exchange]?.(ticker) || `https://finance.yahoo.com/quote/${ticker}`;
  };

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {company.ticker && (
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Ticker:</span>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {company.ticker}
            </Badge>
            {company.exchange && (
              <span className="text-xs text-gray-400">
                ({company.exchange})
              </span>
            )}
          </div>
        )}
        
        {company.lei && (
          <div className="flex items-center gap-1">
            <span className="text-gray-600">LEI:</span>
            <Badge variant="outline" className="text-purple-600 border-purple-200 font-mono text-xs">
              {company.lei.substring(0, 8)}...
            </Badge>
          </div>
        )}

        {company.identifierConfidenceScore && company.identifierConfidenceScore > 0.8 && (
          <Badge variant="outline" className="text-green-600 border-green-200">
            Verified
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900">Company Identifiers</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {company.ticker && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="font-medium text-blue-900">Stock Ticker</div>
              <div className="text-sm text-blue-700">
                {company.ticker}
                {company.exchange && (
                  <span className="ml-2 text-blue-600">
                    on {company.exchange}
                  </span>
                )}
              </div>
            </div>
            {showActions && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(company.ticker!, 'Ticker')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                {company.exchange && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(getExchangeUrl(company.ticker!, company.exchange!), '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {company.lei && (
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div>
              <div className="font-medium text-purple-900">Legal Entity Identifier</div>
              <div className="text-sm font-mono text-purple-700">
                {company.lei}
              </div>
            </div>
            {showActions && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(company.lei!, 'LEI')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(`https://search.gleif.org/#/record/${company.lei}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}

        {company.figi && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <div className="font-medium text-green-900">FIGI</div>
              <div className="text-sm font-mono text-green-700">
                {company.figi}
              </div>
            </div>
            {showActions && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(company.figi!, 'FIGI')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {company.permid && (
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div>
              <div className="font-medium text-orange-900">Refinitiv PermID</div>
              <div className="text-sm font-mono text-orange-700">
                {company.permid}
              </div>
            </div>
            {showActions && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(company.permid!, 'PermID')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {company.identifierConfidenceScore && (
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-gray-600">Identifier Confidence:</span>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            company.identifierConfidenceScore >= 0.9 
              ? 'bg-green-100 text-green-800' 
              : company.identifierConfidenceScore >= 0.7 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {(company.identifierConfidenceScore * 100).toFixed(0)}%
          </div>
        </div>
      )}

      {company.dataSourceAttribution && (
        <div className="text-xs text-gray-500 mt-2">
          Data source: {company.dataSourceAttribution}
        </div>
      )}
    </div>
  );
};

export default CompanyIdentifiers;