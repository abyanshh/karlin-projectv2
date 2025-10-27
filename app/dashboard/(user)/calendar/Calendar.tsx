"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Edit2, Calendar } from "lucide-react";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
  start: Date;
}

interface FormData {
  id?: string;
  title: string;
  start: Date | null;
  calendar: string;
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    title: "",
    start: null,
    calendar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  const calendarsEvents = {
    Primary: "primary",
    Success: "success",
    Danger: "danger",
  };

  useEffect(() => {
    setEvents([
      {
        id: "1",
        title: "Event Conf.",
        start: new Date(),
        extendedProps: { calendar: "Danger" },
      },
      {
        id: "2",
        title: "Meeting",
        start: new Date(Date.now() + 86400000),
        extendedProps: { calendar: "Success" },
      },
      {
        id: "3",
        title: "Workshop",
        start: new Date(Date.now() + 172800000),
        extendedProps: { calendar: "Primary" },
      },
    ]);
  }, []);

  // === handle klik tanggal kosong ===
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetForm();
    setFormData((prev) => ({ ...prev, start: selectInfo.start }));
    setIsEditing(false);
    setIsOpen(true);
  };

  // === handle klik event ===
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setFormData({
      id: event.id,
      title: event.title,
      start: event.start ?? null,
      calendar: event.extendedProps.calendar,
    });
    setIsEditing(true);
    setIsOpen(true);
  };

  // === input universal handler ===
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "start") {
      setFormData((prev) => ({
        ...prev,
        start: value ? new Date(value) : null,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // === add / update ===
  const handleAddOrUpdateEvent = () => {
    if (!formData.start) return;

    if (isEditing && formData.id) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === formData.id
            ? {
                ...ev,
                title: formData.title,
                start: formData.start!,
                extendedProps: { calendar: formData.calendar },
              }
            : ev
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: formData.title,
        start: formData.start!,
        allDay: true,
        extendedProps: { calendar: formData.calendar },
      };
      setEvents((prev) => [...prev, newEvent]);
    }

    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      start: null,
      calendar: "",
    });
    setIsEditing(false);
  };

  const handleEventDrop = (info: any) => {
  const updatedEvent = info.event;

  setEvents((prevEvents) =>
    prevEvents.map((ev) =>
      ev.id === updatedEvent.id
        ? { ...ev, start: updatedEvent.start as Date }
        : ev
    )
  );
};

  const badgeVariant = (level: string) => {
    switch (level) {
      case "Primary":
        return "default";
      case "Success":
        return "success";
      case "Danger":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* === KALENDER === */}
      <div className="rounded-2xl bg-card p-6 shadow-sm border w-full">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "addEventButton",
            center: "title",
          }}
          events={events}
          selectable
          editable
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          eventDrop={handleEventDrop}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: () => {
                resetForm();
                setIsEditing(false);
                setIsOpen(true);
              },
            },
          }}
        />
      </div>

      {/* === LIST EVENT DI KANAN === */}
      <Card className="bg-card shadow-sm border h-full w-full md:max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
          {events.length === 0 && (
            <p className="text-sm text-muted-foreground">No events yet.</p>
          )}
          {events.map((event) => (
            <div
              key={event.id}
              className="group p-3 border rounded-lg flex flex-col gap-1 hover:bg-muted transition-colors cursor-pointer"
              onClick={() => handleEventClick({ event } as any)}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm">{event.title}</h4>
                <div className="flex gap-2 items-center">
                  <Badge variant={badgeVariant(event.extendedProps.calendar)}>
                    {event.extendedProps.calendar}
                  </Badge>
                  <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
                <div className="flex gap-2 items-center text-muted-foreground text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {event.start.toLocaleDateString()}
                  </span>
                </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* === DIALOG === */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[600px] bg-card">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Event" : "Add Event"}</DialogTitle>
            <DialogDescription>
              Schedule or edit your event details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Event Color</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {Object.keys(calendarsEvents).map((key) => (
                  <label
                    key={key}
                    className="flex items-center space-x-2 cursor-pointer text-sm"
                  >
                    <input
                      type="radio"
                      name="calendar"
                      value={key}
                      checked={formData.calendar === key}
                      onChange={handleChange}
                      className="accent-primary"
                    />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="start">Event Date</Label>
              <Input
                id="start"
                name="start"
                type="date"
                value={
                  formData.start
                    ? formData.start.toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button
              onClick={handleAddOrUpdateEvent}
              disabled={
                !formData.title || !formData.start || !formData.calendar
              }
            >
              {isEditing ? "Update Changes" : "Add Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// === Render event di kalender ===
const renderEventContent = (eventInfo: EventContentArg) => {
  const level = eventInfo.event.extendedProps.calendar;
  const colorClass =
    level === "Danger"
      ? "bg-red-500 text-white"
      : level === "Success"
      ? "bg-green-500 text-white"
      : "bg-primary text-white";

  return (
    <div className={`p-1 rounded-md text-xs font-medium w-full ${colorClass}`}>
      {eventInfo.event.title}
    </div>
  );
};


export default CalendarPage;
