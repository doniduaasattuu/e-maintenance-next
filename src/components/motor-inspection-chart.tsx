"use client";

import React from "react";
import { Line, Bar } from "recharts";
import { ChartConfig } from "./ui/chart";
import { InspectionMotor } from "@/types/motor-inspection";
import GenerateLineChart from "./generate-line-chart";
import GenerateBarChart from "./generate-bar-chart";
import GenerateStepChart from "./generate-step-chart";
import TableNote from "./table-note";

const inspectionChartConfig = {
  temperatureDe: {
    label: "Temp DE",
    color: "hsl(var(--mychart-orange))",
  },
  temperatureBody: {
    label: "Temp Body",
    color: "hsl(var(--mychart-teal))",
  },
  temperatureNde: {
    label: "Temp NDE",
    color: "hsl(var(--mychart-blue))",
  },
  vibrationDev: {
    label: "DE Vertical",
    color: "hsl(var(--mychart-sky))",
  },
  vibrationDeh: {
    label: "DE Horizontal",
    color: "hsl(var(--mychart-violet))",
  },
  vibrationDea: {
    label: "DE Axial",
    color: "hsl(var(--mychart-red))",
  },
  vibrationDef: {
    label: "DE Frame",
    color: "hsl(var(--mychart-lime))",
  },
  vibrationNdev: {
    label: "NDE Vertical",
    color: "hsl(var(--mychart-sky))",
  },
  vibrationNdeh: {
    label: "NDE Horizontal",
    color: "hsl(var(--mychart-violet))",
  },
  vibrationNdef: {
    label: "NDE Axial",
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
  isNoisyDe: {
    label: "Noise DE",
    color: "hsl(var(--mychart-orange))",
  },
  isNoisyNde: {
    label: "Noise NDE",
    color: "hsl(var(--mychart-blue))",
  },
  numberOfGreasing: {
    label: "Greasing",
    color: "hsl(var(--mychart-blue))",
  },
} satisfies ChartConfig;

type TempData = {
  date: string;
  temperatureDe: number;
  temperatureBody: number;
  temperatureNde: number;
};

type VibDeData = {
  date: string;
  vibrationDev: number;
  vibrationDeh: number;
  vibrationDea: number;
  vibrationDef: number;
};

type VibNdeData = {
  date: string;
  vibrationNdev: number;
  vibrationNdeh: number;
  vibrationNdef: number;
};

type OperatingData = { date: string; isOperated: number };
type CleanlinessData = { date: string; isClean: number };
type NoiseData = { date: string; isNoisyDe: number; isNoisyNde: number };
type GreasingData = { date: string; numberOfGreasing: number };
type Note = {
  date: Date;
  note: string | null;
  inspector: string | null;
};

type ChartDataResult = {
  tempData: TempData[];
  vibDeData: VibDeData[];
  vibNdeData: VibNdeData[];
  operatingData: OperatingData[];
  cleanlinessData: CleanlinessData[];
  noiseData: NoiseData[];
  greasingData: GreasingData[];
  noteData: Note[];
};

export function generateChartDataFromInspections(
  inspections: InspectionMotor[]
): ChartDataResult {
  return inspections
    .map((item) => {
      const date = new Date(item.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
      });

      return {
        tempData: {
          date,
          temperatureDe: parseFloat(item.temperatureDe ?? "0"),
          temperatureBody: parseFloat(item.temperatureBody ?? "0"),
          temperatureNde: parseFloat(item.temperatureNde ?? "0"),
        },
        vibDeData: {
          date,
          vibrationDev: parseFloat(item.vibrationDev ?? "0"),
          vibrationDeh: parseFloat(item.vibrationDeh ?? "0"),
          vibrationDea: parseFloat(item.vibrationDea ?? "0"),
          vibrationDef: parseFloat(item.vibrationDef ?? "0"),
        },
        vibNdeData: {
          date,
          vibrationNdev: parseFloat(item.vibrationNdev ?? "0"),
          vibrationNdeh: parseFloat(item.vibrationNdeh ?? "0"),
          vibrationNdef: parseFloat(item.vibrationNdef ?? "0"),
        },
        operatingData: {
          date,
          isOperated: item.isOperated ? 1 : 0,
        },
        cleanlinessData: {
          date,
          isClean: item.isClean ? 1 : 0,
        },
        noiseData: {
          date,
          isNoisyDe: item.isNoisyDe ? 1 : 0,
          isNoisyNde: item.isNoisyNde ? 1 : 0,
        },
        greasingData: {
          date,
          numberOfGreasing: parseFloat(item.numberOfGreasing ?? "0"),
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
        acc.tempData.push(curr.tempData);
        acc.vibDeData.push(curr.vibDeData);
        acc.vibNdeData.push(curr.vibNdeData);
        acc.operatingData.push(curr.operatingData);
        acc.cleanlinessData.push(curr.cleanlinessData);
        acc.noiseData.push(curr.noiseData);
        acc.greasingData.push(curr.greasingData);
        acc.noteData.push(curr.noteData);
        return acc;
      },
      {
        tempData: [],
        vibDeData: [],
        vibNdeData: [],
        operatingData: [],
        cleanlinessData: [],
        noiseData: [],
        greasingData: [],
        noteData: [],
      }
    );
}

export default function MotorInspectionChart({
  motorInspections,
}: {
  motorInspections: InspectionMotor[];
}) {
  const {
    tempData,
    vibDeData,
    vibNdeData,
    operatingData,
    cleanlinessData,
    noiseData,
    greasingData,
    noteData,
  } = generateChartDataFromInspections(motorInspections);

  return (
    <section className="space-y-4 lg:space-y-6 gap-4 lg:gap-6">
      {/* TEMPERATURE */}
      <GenerateLineChart
        title="Temperature"
        description="Visualizes temperature chart"
        config={inspectionChartConfig}
        data={tempData}
        YAxisLabel="Temperature (°C)"
        className="aspect-auto h-[250px] w-full"
      >
        <Line
          dataKey="temperatureDe"
          type="monotone"
          stroke="var(--color-temperatureDe)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="temperatureBody"
          type="monotone"
          stroke="var(--color-temperatureBody)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="temperatureNde"
          type="monotone"
          stroke="var(--color-temperatureNde)"
          strokeWidth={2}
          dot={false}
        />
      </GenerateLineChart>

      {/* VIBRATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* VIBRATION DE */}
        <GenerateLineChart
          title="Vibration DE"
          description="Visualize vibration chart"
          config={inspectionChartConfig}
          data={vibDeData}
          YAxisLabel="Vibration (mm/s)"
          className="aspect-auto h-[250px] w-full"
        >
          <Line
            dataKey="vibrationDev"
            type="monotone"
            stroke="var(--color-vibrationDev)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="vibrationDeh"
            type="monotone"
            stroke="var(--color-vibrationDeh)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="vibrationDea"
            type="monotone"
            stroke="var(--color-vibrationDea)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="vibrationDef"
            type="monotone"
            stroke="var(--color-vibrationDef)"
            strokeWidth={2}
            dot={false}
          />
        </GenerateLineChart>

        {/* VIBRATION NDE */}
        <GenerateLineChart
          title="Vibration NDE"
          description="Visualize vibration chart"
          config={inspectionChartConfig}
          data={vibNdeData}
          YAxisLabel="Vibration (mm/s)"
          className="aspect-auto h-[250px] w-full"
        >
          <Line
            dataKey="vibrationNdev"
            type="monotone"
            stroke="var(--color-vibrationNdev)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="vibrationNdeh"
            type="monotone"
            stroke="var(--color-vibrationNdeh)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="vibrationNdef"
            type="monotone"
            stroke="var(--color-vibrationNdef)"
            strokeWidth={2}
            dot={false}
          />
        </GenerateLineChart>
      </div>

      {/* NOISY */}
      <GenerateStepChart
        title="Noisy"
        description="Bearing noise DE & NDE history"
        config={inspectionChartConfig}
        data={noiseData}
        className="aspect-auto h-[120px] w-full"
      >
        <Line
          dataKey="isNoisyDe"
          type="step"
          stroke="var(--color-isNoisyDe)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="isNoisyNde"
          type="step"
          stroke="var(--color-isNoisyNde)"
          strokeWidth={2}
          dot={false}
        />
      </GenerateStepChart>

      {/* STATUS AND CLEANLINESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* OPERATIONAL STATUS */}
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

        {/* CLEANLINESS */}
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

      {/* GREASING */}
      <GenerateBarChart
        title="Greasing"
        description="Motor greasing history"
        config={inspectionChartConfig}
        data={greasingData}
        className="aspect-auto h-[180px] w-full"
        YAxisLabel="Pump (0.56 ~ 3.10 grams)"
      >
        <Bar
          dataKey="numberOfGreasing"
          fill="var(--color-numberOfGreasing)"
          radius={8}
        />
      </GenerateBarChart>

      <TableNote noteData={noteData} />
    </section>
  );
}
