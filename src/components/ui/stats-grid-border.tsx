interface StatsGridProps {
  stats: Array<{
    value: string;
    label: string;
  }>;
}

import { DotPattern } from "./dot-pattern";

export function StatsGridBorder({ stats }: StatsGridProps) {
  return (
    <div className="relative h-64 md:h-80 lg:h-96">
      <div className="absolute inset-0 overflow-hidden ">
        <div className="relative flex h-full flex-col items-center border border-primary">
          <DotPattern 
            width={5} 
            height={5}
            cx={2.5}
            cy={2.5}
            cr={1}
            className="opacity-30 fill-primary"
          />
          
          {/* Corner Decorations */}
          <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-primary" />
          <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-primary" />
          <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-primary" />
          <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-primary" />

          <div className="relative z-20 grid h-full w-full grid-cols-2 grid-rows-2">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center p-6 text-center ${
                  index % 2 === 0 ? 'border-r border-primary' : ''
                } ${index < 2 ? 'border-b border-primary' : ''}`}
              >
                <div className="font-bold text-3xl mb-2">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
