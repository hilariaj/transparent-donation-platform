"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { MapPin, Users } from "lucide-react"
import { causes } from "@/lib/mock-data"
import type { Cause } from "@/lib/types"

interface CausesListProps {
  searchQuery: string
  category: string
  onSelectCause: (cause: Cause) => void
}

export function CausesList({ searchQuery, category, onSelectCause }: CausesListProps) {
  const filteredCauses = useMemo(() => {
    return causes.filter((cause) => {
      const matchesSearch =
        searchQuery === "" ||
        cause.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cause.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cause.aiSummary.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = category === "all" || cause.category === category

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, category])

  if (filteredCauses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No causes found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCauses.map((cause) => {
        const progress = (cause.raised / cause.goal) * 100

        return (
          <Card key={cause.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {cause.category}
                </Badge>
                {cause.verified && (
                  <Badge variant="default" className="bg-green-600">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{cause.name}</CardTitle>
              <CardDescription className="text-sm font-medium text-foreground/70">{cause.organization}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">{cause.aiSummary}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{cause.raised} ETH raised</span>
                  <span className="text-muted-foreground">of {cause.goal} ETH</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex flex-wrap gap-1">
                {cause.aiTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {cause.location}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {cause.donors} donors
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full" onClick={() => onSelectCause(cause)}>
                Donate Now
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
