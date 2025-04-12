"use client";

import React from "react";
import { Finding } from "@/types/finding";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { FindingStatus } from "@/types/finding-status";
import { Edit, ImageOff, MoreHorizontal, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import OptionsDropdown from "./options-dropdown";
import Link from "next/link";

export default function FindingList({
  findings,
  findingStatuses,
}: {
  findings: Finding[];
  findingStatuses: FindingStatus[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-2">
      {findings &&
        findings.length >= 1 &&
        findings.map((finding) => (
          <Card className="w-full rounded-lg shadow-md p-0" key={finding.id}>
            <CardContent className="p-2">
              <div className="relative w-full h-80 md:h-48 rounded-md overflow-hidden">
                {finding.findingImages && finding.findingImages.length > 0 ? (
                  <Carousel>
                    <CarouselContent>
                      {finding.findingImages.map((image) => (
                        <CarouselItem key={image.id}>
                          <Card className="p-0">
                            <CardContent className="aspect-square p-0 rounded-md">
                              <div className="absolute z-10 text-xs p-2">
                                <Badge
                                  variant={"secondary"}
                                  className="text-muted-foreground"
                                >
                                  {image.imageStatus}
                                </Badge>
                              </div>
                              <div className="relative w-full h-full overflow-hidden rounded-md">
                                <Image
                                  alt={image.path}
                                  src={image.path}
                                  fill
                                  className="object-cover object-center"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-md gap-2 text-sm">
                    <ImageOff size={20} />
                    No Images
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {finding?.equipment?.id}
                </span>
                <Badge
                  className="text-xs"
                  variant={
                    findingStatuses.find(
                      (status) => status.id === finding.findingStatusId
                    )?.description === "Open"
                      ? "destructive"
                      : "default"
                  }
                >
                  {(findingStatuses &&
                    findingStatuses.find(
                      (status) => status.id === finding.findingStatusId
                    )?.description) ||
                    "Unknown"}
                </Badge>
              </div>
              <p className="mt-3 text-sm h-15 text-muted-foreground truncate text-wrap">
                {finding.description}
              </p>
              <Separator className="mt-3" />
              <div className="flex justify-between mt-3">
                <p className="text-xs text-muted-foreground">
                  {formatDate(finding.createdAt)}
                </p>
                <OptionsDropdown
                  trigger={<MoreHorizontal className="text-muted-foreground" />}
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/findings/${finding.id}/edit`}
                      className="font-sm link"
                    >
                      <Edit />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </OptionsDropdown>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
