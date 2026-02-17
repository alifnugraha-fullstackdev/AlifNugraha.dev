import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LiveryKRL } from "./livery.component";

export type TransportInformationTableProps = {
  transportation: {
    type: "krl" | "mrt";
    line: string;
    id: string;
    color: string;
  };
} & (
  | {
      underConstruction: false;
      hasTried: false;
      personalHopeRate: {
        score: number;
        comment: string;
      };
    }
  | {
      underConstruction: false;
      hasTried: true;
      personalRate: {
        score: number;
        comment: string;
      };
      details: {
        rides: number;
        mostFrequentRoute: {
          from: {
            stationName: string;
            liveryStationName: string;
            liveryStationHeight: number;
          };
          to: {
            stationName: string;
            liveryStationName: string;
            liveryStationHeight: number;
          };
        };
      };
    }
  | {
      underConstruction: true;
      hasTried: false;
      personalHopeRate: {
        score: number;
        comment: string;
      };
    }
);

export function TransportInformationTable(
  props: TransportInformationTableProps,
) {
  return (
    <div className="not-prose">
      <header className="mt-2 flex items-center gap-4">
        <div
          className="flex size-6 flex-col items-center justify-center rounded-full outline-4"
          style={{
            outlineColor: props.transportation.color,
          }}
        >
          <p className="m-auto font-bold">{props.transportation.id}</p>
        </div>
        <p className="font-medium text-2xl">{props.transportation.line} Line</p>
      </header>
      <Separator className="mt-2 mb-5 border-muted border-b-[0.3px]" />
      {props.hasTried ? (
        <div className="space-y-2">
          <section className="flex flex-col rounded-xs border bg-accent/50 p-4 px-5 dark:bg-accent/30">
            <p className="font-medium text-lg">Personal Rate</p>
            <span className="inline-flex items-center gap-2 font-bold text-3xl">
              <Star className="text-amber-400" /> {props.personalRate.score}/10
            </span>
            <p className="text-muted-foreground italic">
              "{props.personalRate.comment}"
            </p>
          </section>
          {props.transportation.type === "krl" ? (
            <section className="flex flex-col gap-2 rounded-xs border bg-accent/50 p-4 px-5 dark:bg-accent/30">
              <p className="font-medium text-lg">Most Frequent Ride</p>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-sm">from</p>
                  <LiveryKRL
                    transportation={props.details.mostFrequentRoute.from}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-sm">to</p>
                  <LiveryKRL
                    transportation={props.details.mostFrequentRoute.to}
                  />
                </div>
              </div>
              <p className="mt-1 text-center text-muted-foreground text-xs">
                roughly {props.details.rides}+ rides taken
              </p>
            </section>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
