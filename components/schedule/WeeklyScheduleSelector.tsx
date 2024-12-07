import React, { useState, useRef, useEffect } from "react";
import { Pressable, Dimensions } from "react-native";
import { format } from "date-fns";
import { Text, View, useTheme } from "tamagui";

type TimeSlot = {
  hour: number;
  selected: boolean;
};

type DaySchedule = {
  day: string;
  timeSlots: TimeSlot[];
};

type WeeklyScheduleSelectorProps = {
  value: DaySchedule[];
  onChange: (schedule: DaySchedule[]) => void;
  helperText?: string;
};

export function WeeklyScheduleSelector({
  value,
  onChange,
  helperText,
}: WeeklyScheduleSelectorProps) {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const SCREENMARGIN = 60;
  const timeLabelWidth = 42;
  const slotWidth = (screenWidth - SCREENMARGIN - timeLabelWidth) / 7; // Calculate slot width

  const [isDragging, setIsDragging] = useState(false);
  const [selectedState, setSelectedState] = useState(false);
  const [lastTouchedSlot, setLastTouchedSlot] = useState<{
    day: number;
    hour: number;
  } | null>(null);
  const [timeSlots, setTimeSlots] = useState<DaySchedule[]>(value);

  useEffect(() => {
    setTimeSlots(value);
  }, [value]);

  const slotRefs = useRef<{
    [key: string]: { x: number; y: number; width: number; height: number };
  }>({});

  const handleSlotInteraction = (
    day: number,
    hour: number,
    isStart: boolean = false
  ) => {
    if (lastTouchedSlot?.day === day && lastTouchedSlot?.hour === hour) {
      return;
    }

    setLastTouchedSlot({ day, hour });

    if (isStart) {
      setIsDragging(true);
      const daySchedule = timeSlots[day];
      const currentSlot = daySchedule.timeSlots.find(
        (slot) => slot.hour === hour
      );
      const newSelectedState = !currentSlot?.selected;
      setSelectedState(newSelectedState);

      const newTimeSlots = timeSlots.map((daySchedule, dayIndex) => {
        if (dayIndex === day) {
          return {
            ...daySchedule,
            timeSlots: daySchedule.timeSlots.map((slot) =>
              slot.hour === hour ? { ...slot, selected: !slot.selected } : slot
            ),
          };
        }
        return daySchedule;
      });

      setTimeSlots(newTimeSlots);
      onChange(newTimeSlots);
    } else if (isDragging) {
      const newTimeSlots = timeSlots.map((daySchedule, dayIndex) => {
        if (dayIndex === day) {
          return {
            ...daySchedule,
            timeSlots: daySchedule.timeSlots.map((slot) =>
              slot.hour === hour ? { ...slot, selected: selectedState } : slot
            ),
          };
        }
        return daySchedule;
      });

      setTimeSlots(newTimeSlots);
      onChange(newTimeSlots);
    }
  };

  const handleTouchMove = (e: any) => {
    if (!isDragging) return;

    const touch = e.nativeEvent.touches[0];
    const { pageX, pageY } = touch;

    Object.entries(slotRefs.current).forEach(([key, layout]) => {
      if (
        pageX >= layout.x &&
        pageX <= layout.x + layout.width &&
        pageY >= layout.y &&
        pageY <= layout.y + layout.height
      ) {
        const [day, hour] = key.split("-").map(Number);
        handleSlotInteraction(day, hour);
      }
    });
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
    setLastTouchedSlot(null);
  };

  return (
    <View
      style={{
        backgroundColor: "$background",
        padding: 4,
        width: screenWidth,
        paddingLeft: 0,
        marginTop: -10,
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleInteractionEnd}
    >
      <View
        style={{
          flexDirection: "row",
          height: 30,
          marginTop: -10,
          width: '100%',
        }}
      >
        <View style={{ width: timeLabelWidth }} />
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <View
            key={day}
            style={{
              width: slotWidth,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: theme.color.val,
              }}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={{
          height: 500,
          marginTop: -5,
          width: '100%',
        }}
      >
        {Array.from({ length: 13 }, (_, hour) => (
          <View
            key={hour}
            style={{
              flexDirection: "row",
              height: 34,
              width: '100%',
            }}
          >
            <View
              style={{
                width: timeLabelWidth,
                justifyContent: "center",
                alignItems: "flex-end",
                paddingRight: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: theme.color.val,
                  minWidth: 27,
                }}
              >
                {format(new Date().setHours(hour + 8), "h a")}
              </Text>
            </View>

            {Array.from({ length: 7 }, (_, day) => (
              <Pressable
                key={`${day}-${hour}`}
                ref={(ref) => {
                  if (ref) {
                    ref.measure((x, y, width, height, pageX, pageY) => {
                      slotRefs.current[`${day}-${hour + 8}`] = {
                        x: pageX,
                        y: pageY,
                        width,
                        height,
                      };
                    });
                  }
                }}
                onPressIn={() => handleSlotInteraction(day, hour + 8, true)}
                style={({ pressed }) => ({
                  width: slotWidth,
                  borderWidth: 0.5,
                  borderColor: theme.gray.val,
                  backgroundColor: timeSlots[day].timeSlots.find(
                    (slot) => slot.hour === hour + 8
                  )?.selected
                    ? theme.primary.val
                    : theme.background.val,
                })}
              />
            ))}
          </View>
        ))}
      </View>

      {helperText && (
        <View
          style={{
            paddingTop: 4,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: theme.color.val,
              textAlign: "center",
            }}
          >
            {helperText}
          </Text>
        </View>
      )}
    </View>
  );
}