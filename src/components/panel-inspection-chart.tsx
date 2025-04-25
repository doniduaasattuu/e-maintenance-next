"use client";

import React from "react";
import { Line } from "recharts";
import { ChartConfig } from "./ui/chart";
import GenerateLineChart from "./generate-line-chart";
import GenerateStepChart from "./generate-step-chart";
import TableNote from "./table-note";
import { InspectionPanel } from "@/types/panel-inspection";

const inspectionChartConfig = {
  temperatureOutgoingR: {
    label: "Outgoing R",
    color: "hsl(var(--mychart-orange))",
  },
  temperatureOutgoingS: {
    label: "Outgoing S",
    color: "hsl(var(--mychart-teal))",
  },
  temperatureOutgoingT: {
    label: "Outgoing T",
    color: "hsl(var(--mychart-blue))",
  },
  temperatureIncomingR: {
    label: "Incoming R",
    color: "hsl(var(--mychart-sky))",
  },
  temperatureIncomingS: {
    label: "Incoming S",
    color: "hsl(var(--mychart-violet))",
  },
  temperatureIncomingT: {
    label: "Incoming T",
    color: "hsl(var(--mychart-red))",
  },
  temperatureCabinet: {
    label: "Cabinet",
    color: "hsl(var(--mychart-lime))",
  },
  currentR: {
    label: "Current R",
    color: "hsl(var(--mychart-sky))",
  },
  currentS: {
    label: "Current S",
    color: "hsl(var(--mychart-violet))",
  },
  currentT: {
    label: "Current T",
    color: "hsl(var(--mychart-red))",
  },
  isOperated: {
    label: "Operational",
    color: "hsl(var(--mychart-pink))",
  },
  isClean: {
    label: "Cleanliness",
    color: "hsl(var(--mychart-teal))",
  },
  isNoisy: {
    label: "Panel noise",
    color: "hsl(var(--mychart-orange))",
  },
  isIndicatorOk: {
    label: "Indicator",
    color: "hsl(var(--mychart-blue))",
  },
  isLabelOk: {
    label: "Label",
    color: "hsl(var(--mychart-sky))",
  },
} satisfies ChartConfig;

type TempIncomingData = {
  date: string;
  temperatureIncomingR: number;
  temperatureIncomingS: number;
  temperatureIncomingT: number;
  temperatureCabinet: number;
};

type TempOutgoingData = {
  date: string;
  temperatureOutgoingR: number;
  temperatureOutgoingS: number;
  temperatureOutgoingT: number;
};

type CurrentData = {
  date: string;
  currentR: number;
  currentS: number;
  currentT: number;
};

type OperatingData = { date: string; isOperated: number };
type CleanlinessData = { date: string; isClean: number };
type NoiseData = { date: string; isNoisy: number };
type MimicData = { date: string; isLabelOk: number; isIndicatorOk: number };
type Note = {
  date: Date;
  note: string | null;
  inspector: string | null;
};

type ChartDataResult = {
  operatingData: OperatingData[];
  cleanlinessData: CleanlinessData[];
  noiseData: NoiseData[];
  mimicData: MimicData[];
  tempIncomingData: TempIncomingData[];
  tempOutgoingData: TempOutgoingData[];
  currentData: CurrentData[];
  noteData: Note[];
};

export function generateChartDataFromInspections(
  inspections: InspectionPanel[]
): ChartDataResult {
  return inspections
    .map((item) => {
      const date = new Date(item.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
      });

      return {
        tempIncomingData: {
          date,
          temperatureIncomingR: parseFloat(item.temperatureIncomingR ?? "0"),
          temperatureIncomingS: parseFloat(item.temperatureIncomingS ?? "0"),
          temperatureIncomingT: parseFloat(item.temperatureIncomingT ?? "0"),
          temperatureCabinet: parseFloat(item.temperatureCabinet ?? "0"),
        },
        tempOutgoingData: {
          date,
          temperatureOutgoingR: parseFloat(item.temperatureOutgoingR ?? "0"),
          temperatureOutgoingS: parseFloat(item.temperatureOutgoingS ?? "0"),
          temperatureOutgoingT: parseFloat(item.temperatureOutgoingT ?? "0"),
        },
        currentData: {
          date,
          currentR: parseFloat(item.currentR ?? "0"),
          currentS: parseFloat(item.currentS ?? "0"),
          currentT: parseFloat(item.currentT ?? "0"),
        },
        operatingData: {
          date,
          isOperated: item.isOperated ? 1 : 0,
        },
        cleanlinessData: {
          date,
          isClean: item.isClean ? 1 : 0,
        },
        mimicData: {
          date,
          isIndicatorOk: item.isIndicatorOk ? 1 : 0,
          isLabelOk: item.isLabelOk ? 1 : 0,
        },
        noiseData: {
          date,
          isNoisy: item.isNoisy ? 1 : 0,
        },
        noteData: {
          date: item.createdAt,
          note: item.note,
          inspector: item.inspector ?? null,
        },
      };
    })
    .reduce<ChartDataResult>(
      (acc, curr) => {
        acc.operatingData.push(curr.operatingData);
        acc.cleanlinessData.push(curr.cleanlinessData);
        acc.noiseData.push(curr.noiseData);
        acc.mimicData.push(curr.mimicData);
        acc.tempIncomingData.push(curr.tempIncomingData);
        acc.tempOutgoingData.push(curr.tempOutgoingData);
        acc.currentData.push(curr.currentData);
        acc.noteData.push(curr.noteData);
        return acc;
      },
      {
        operatingData: [],
        cleanlinessData: [],
        noiseData: [],
        mimicData: [],
        tempIncomingData: [],
        tempOutgoingData: [],
        currentData: [],
        noteData: [],
      }
    );
}

export default function PanelInspectionChart({
  panelInspections,
}: {
  panelInspections: InspectionPanel[];
}) {
  const {
    operatingData,
    cleanlinessData,
    noiseData,
    mimicData,
    tempIncomingData,
    tempOutgoingData,
    currentData,
    noteData,
  } = generateChartDataFromInspections(panelInspections);

  return (
    <section className="space-y-4 lg:space-y-6 gap-4 lg:gap-6">
      {/* TEMPERATURE */}
      <GenerateLineChart
        title="Current load"
        description="Visualizes current chart"
        config={inspectionChartConfig}
        data={currentData}
        YAxisLabel="Current (A)"
        className="aspect-auto h-[250px] w-full"
      >
        <Line
          dataKey="currentR"
          type="monotone"
          stroke="var(--color-currentR)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="currentS"
          type="monotone"
          stroke="var(--color-currentS)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="currentT"
          type="monotone"
          stroke="var(--color-currentT)"
          strokeWidth={2}
          dot={false}
        />
      </GenerateLineChart>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <GenerateLineChart
          title="Temperature Incoming"
          description="Visualize temperature chart"
          config={inspectionChartConfig}
          data={tempIncomingData}
          YAxisLabel="Temperature (°C)"
          className="aspect-auto h-[250px] w-full"
        >
          <Line
            dataKey="temperatureIncomingR"
            type="monotone"
            stroke="var(--color-temperatureIncomingR)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="temperatureIncomingS"
            type="monotone"
            stroke="var(--color-temperatureIncomingS)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="temperatureIncomingT"
            type="monotone"
            stroke="var(--color-temperatureIncomingT)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="temperatureCabinet"
            type="monotone"
            stroke="var(--color-temperatureCabinet)"
            strokeWidth={2}
            dot={false}
          />
        </GenerateLineChart>

        <GenerateLineChart
          title="Temperature Outgoing"
          description="Visualize temperature chart"
          config={inspectionChartConfig}
          data={tempOutgoingData}
          YAxisLabel="Temperature (°C)"
          className="aspect-auto h-[250px] w-full"
        >
          <Line
            dataKey="temperatureOutgoingR"
            type="monotone"
            stroke="var(--color-temperatureOutgoingR)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="temperatureOutgoingS"
            type="monotone"
            stroke="var(--color-temperatureOutgoingS)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="temperatureOutgoingT"
            type="monotone"
            stroke="var(--color-temperatureOutgoingT)"
            strokeWidth={2}
            dot={false}
          />
        </GenerateLineChart>
      </div>

      <GenerateStepChart
        title="Noisy"
        description="Panel noise abnormality"
        config={inspectionChartConfig}
        data={noiseData}
        className="aspect-auto h-[120px] w-full"
      >
        <Line
          dataKey="isNoisy"
          type="step"
          stroke="var(--color-isNoisy)"
          strokeWidth={2}
          dot={false}
        />
      </GenerateStepChart>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <GenerateStepChart
          title="Status"
          description="Operating status while inspection"
          config={inspectionChartConfig}
          data={operatingData}
          className="aspect-auto h-[120px] w-full"
        >
          <Line
            dataKey="isOperated"
            type="step"
            stroke="var(--color-isOperated)"
            strokeWidth={2}
            dot={false}
          />
        </GenerateStepChart>

        <GenerateStepChart
          title="Cleanliness"
          description="Cleaning action while inspection"
          config={inspectionChartConfig}
          data={cleanlinessData}
          className="aspect-auto h-[120px] w-full"
        >
          <Line
            dataKey="isClean"
            type="step"
            stroke="var(--color-isClean)"
            strokeWidth={2}
            dot={false}
          />
        </GenerateStepChart>
      </div>

      <GenerateStepChart
        title="Mimic"
        description="Panel mimic indicator"
        config={inspectionChartConfig}
        data={mimicData}
        className="aspect-auto h-[120px] w-full"
      >
        <Line
          dataKey="isIndicatorOk"
          type="step"
          stroke="var(--color-isIndicatorOk)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="isLabelOk"
          type="step"
          stroke="var(--color-isLabelOk)"
          strokeWidth={2}
          dot={false}
        />
      </GenerateStepChart>

      <TableNote noteData={noteData} />
    </section>
  );
}
