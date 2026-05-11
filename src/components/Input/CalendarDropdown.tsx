import React, { useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  label: string;
  value?: Date;
  onChange?: (date: Date) => void;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date) {
  return isSameDay(date, new Date());
}

function formatDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarDropdown({
  label,
  value,
  onChange,
  error,
  minDate,
  maxDate,
}: Props) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'day' | 'month' | 'year'>('day');
  const [yearDecadeStart, setYearDecadeStart] = useState(
    Math.floor((value ? value.getFullYear() : today.getFullYear()) / 12) * 12,
  );
  const [viewYear, setViewYear] = useState(
    value ? value.getFullYear() : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    value ? value.getMonth() : today.getMonth(),
  );
  const rotate = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (open) setMode('day');
    setOpen(prev => !prev);
    Animated.timing(rotate, {
      toValue: open ? 0 : 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const arrowRotate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const goToPrevMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    return false;
  };

  const handleDayPress = (day: number) => {
    if (isDisabled(day)) return;
    onChange?.(new Date(viewYear, viewMonth, day));
    setOpen(false);
    setMode('day');
    rotate.setValue(0);
  };

  const handleMonthSelect = (monthIdx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setViewMonth(monthIdx);
    setMode('day');
  };

  const handleYearSelect = (year: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setViewYear(year);
    setMode('month');
  };

  // Build year range for current page (12 years)
  const currentYear = today.getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => yearDecadeStart + i);

  const goToPrevYears = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setYearDecadeStart(s => s - 12);
  };

  const goToNextYears = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setYearDecadeStart(s => s + 12);
  };

  return (
    <View style={{ marginBottom: 22 }}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.container, error && { borderColor: '#EF4444' }]}>
        {/* Trigger row */}
        <TouchableOpacity activeOpacity={0.8} style={styles.inputRow} onPress={toggle}>
          <View style={styles.inputLeft}>
            <Text style={styles.calendarIcon}>📅</Text>
            <Text style={[styles.value, !value && { color: '#9CA3AF' }]}>
              {value ? formatDate(value) : 'Select date'}
            </Text>
          </View>
          <Animated.Text style={[styles.arrow, { transform: [{ rotate: arrowRotate }] }]}>
            ▼
          </Animated.Text>
        </TouchableOpacity>

        {/* Calendar panel */}
        {open && (
          <View style={styles.calendarPanel}>
            <View style={styles.divider} />

            {/* ── Month / Year nav header ── */}
            <View style={styles.monthNav}>
              {mode === 'day' && (
                <TouchableOpacity onPress={goToPrevMonth} style={styles.navBtn}>
                  <Text style={styles.navArrow}>‹</Text>
                </TouchableOpacity>
              )}

              <View style={styles.monthYearBtn}>
                {/* Tap month name → month picker */}
                <TouchableOpacity
                  style={[
                    styles.pillSegment,
                    mode === 'month' && styles.pillSegmentActive,
                  ]}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setMode(prev => prev === 'month' ? 'day' : 'month');
                  }}
                >
                  <Text style={[styles.monthYear, mode === 'month' && styles.pillSegmentActiveText]}>
                    {MONTHS[viewMonth].slice(0, 3)}
                    <Text style={styles.modeCaret}>{mode === 'month' ? ' ▴' : ' ▾'}</Text>
                  </Text>
                </TouchableOpacity>

                <Text style={styles.pillDivider}>·</Text>

                {/* Tap year → year picker */}
                <TouchableOpacity
                  style={[
                    styles.pillSegment,
                    mode === 'year' && styles.pillSegmentActive,
                  ]}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setMode(prev => prev === 'year' ? 'day' : 'year');
                  }}
                >
                  <Text style={[styles.yearPill, mode === 'year' && styles.pillSegmentActiveText]}>
                    {viewYear}
                    <Text style={styles.modeCaret}>{mode === 'year' ? ' ▴' : ' ▾'}</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {mode === 'day' && (
                <TouchableOpacity onPress={goToNextMonth} style={styles.navBtn}>
                  <Text style={styles.navArrow}>›</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ── Year picker ── */}
            {mode === 'year' && (
              <View>
                {/* Year range nav */}
                <View style={styles.monthNav}>
                  <TouchableOpacity onPress={goToPrevYears} style={styles.navBtn}>
                    <Text style={styles.navArrow}>‹</Text>
                  </TouchableOpacity>
                  <Text style={styles.monthYear}>
                    {yearDecadeStart} – {yearDecadeStart + 11}
                  </Text>
                  <TouchableOpacity onPress={goToNextYears} style={styles.navBtn}>
                    <Text style={styles.navArrow}>›</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.yearGrid}>
                  {years.map(y => {
                    const isSelected = y === viewYear;
                    const isCurrent = y === currentYear;
                    return (
                      <TouchableOpacity
                        key={y}
                        style={[styles.yearCell, isSelected && styles.selectedCell]}
                        onPress={() => handleYearSelect(y)}
                      >
                        <Text style={[
                          styles.yearText,
                          isCurrent && !isSelected && styles.todayText,
                          isSelected && styles.selectedText,
                        ]}>
                          {y}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ── Month picker ── */}
            {mode === 'month' && (
              <View style={styles.monthGrid}>
                {MONTHS.map((m, idx) => {
                  const isSelected = idx === viewMonth;
                  const isCurrent = idx === today.getMonth() && viewYear === currentYear;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[styles.monthCell, isSelected && styles.selectedCell]}
                      onPress={() => handleMonthSelect(idx)}
                    >
                      <Text style={[
                        styles.monthCellText,
                        isCurrent && !isSelected && styles.todayText,
                        isSelected && styles.selectedText,
                      ]}>
                        {m.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* ── Day grid ── */}
            {mode === 'day' && (
              <>
                <View style={styles.row}>
                  {DAYS.map(d => (
                    <Text key={d} style={styles.dayHeader}>{d}</Text>
                  ))}
                </View>

                {Array.from({ length: cells.length / 7 }, (_, weekIdx) => (
                  <View key={weekIdx} style={styles.row}>
                    {cells.slice(weekIdx * 7, weekIdx * 7 + 7).map((day, idx) => {
                      if (!day) return <View key={idx} style={styles.dayCell} />;

                      const date = new Date(viewYear, viewMonth, day);
                      const selected = value ? isSameDay(date, value) : false;
                      const todayCell = isToday(date);
                      const disabled = isDisabled(day);

                      return (
                        <TouchableOpacity
                          key={idx}
                          style={[
                            styles.dayCell,
                            todayCell && !selected && styles.todayCell,
                            selected && styles.selectedCell,
                            disabled && styles.disabledCell,
                          ]}
                          onPress={() => handleDayPress(day)}
                          activeOpacity={disabled ? 1 : 0.7}
                        >
                          <Text style={[
                            styles.dayText,
                            todayCell && !selected && styles.todayText,
                            selected && styles.selectedText,
                            disabled && styles.disabledText,
                          ]}>
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}

                {/* Today shortcut */}
                <TouchableOpacity
                  style={styles.todayBtn}
                  onPress={() => {
                    onChange?.(today);
                    setViewYear(today.getFullYear());
                    setViewMonth(today.getMonth());
                    setOpen(false);
                    setMode('day');
                    rotate.setValue(0);
                  }}
                >
                  <Text style={styles.todayBtnText}>Today</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const CELL_SIZE = 36;

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    color: '#000000',
    fontSize: 13,
    marginLeft: 6,
  },

  container: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  inputRow: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  inputLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  calendarIcon: {
    fontSize: 18,
  },

  value: {
    fontSize: 16,
    color: '#111827',
  },

  arrow: {
    fontSize: 14,
    color: '#6B7280',
  },

  calendarPanel: {
    paddingHorizontal: 12,
    paddingBottom: 14,
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
  },

  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  navArrow: {
    fontSize: 22,
    color: '#374151',
    lineHeight: 26,
  },

  monthYear: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 0.2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },

  dayHeader: {
    width: CELL_SIZE,
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 4,
  },

  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  todayCell: {
    borderWidth: 1.5,
    borderColor: '#6366F1',
  },

  selectedCell: {
    backgroundColor: '#6366F1',
  },

  disabledCell: {
    opacity: 0.35,
  },

  dayText: {
    fontSize: 14,
    color: '#111827',
  },

  todayText: {
    color: '#6366F1',
    fontWeight: '700',
  },

  selectedText: {
    color: '#fff',
    fontWeight: '700',
  },

  disabledText: {
    color: '#9CA3AF',
  },

  monthYearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    overflow: 'hidden',
  },

  pillSegment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  pillSegmentActive: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
  },

  pillSegmentActiveText: {
    color: '#fff',
  },

  pillDivider: {
    color: '#D1D5DB',
    fontSize: 16,
  },

  yearPill: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
  },

  modeCaret: {
    fontSize: 11,
    color: '#6366F1',
    marginLeft: 2,
  },

  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 4,
  },

  monthCell: {
    width: '30%',
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },

  monthCellText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },

  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 4,
  },

  yearCell: {
    width: '30%',
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },

  yearText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },

  yearSwitchRow: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
    paddingVertical: 8,
  },

  yearSwitchText: {
    color: '#6366F1',
    fontSize: 13,
    fontWeight: '600',
  },

  todayBtn: {
    marginTop: 10,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
  },

  todayBtnText: {
    color: '#6366F1',
    fontSize: 13,
    fontWeight: '600',
  },

  error: {
    marginTop: 6,
    color: '#EF4444',
    fontSize: 12,
  },
});
