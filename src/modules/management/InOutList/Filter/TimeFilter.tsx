import chroma from 'chroma-js';
import ReactDatePicker from 'react-datepicker';
import { FormField, Input, Label } from 'src/components/form';
import { GridContainer, GridItem } from 'src/components/grid';
import { colors } from 'src/configs/theme';
import { TimeOption, useFilterStore } from './store';

const configs: Array<{ key: TimeOption; title: string }> = [
  { key: '7da', title: '7d ago' },
  { key: '1ma', title: '1m ago' },
  { key: '3ma', title: '3m ago' },
  { key: '6ma', title: '6m ago' },
  { key: '1ya', title: '1y ago' },
];

export default function TimeFilter() {
  const time = useFilterStore((state) => state.time);
  const updateTime = useFilterStore((state) => state.updateTime);

  const isDateError =
    typeof time === 'object' &&
    time !== null &&
    (!time.to || !time.from || new Date(time.from).getTime() > new Date(time.to).getTime());

  return (
    <div css={{ marginTop: 4 }}>
      <div css={{ display: 'flex', flexWrap: 'wrap', marginBottom: 16 }}>
        {configs.map((item) => (
          <div
            key={item.key as string}
            className={time === item.key ? 'selected' : undefined}
            css={{
              marginTop: 8,
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4px 12px',
              border: '1px solid',
              borderColor: chroma(colors.textPrimary).alpha(0.35).hex(),
              borderRadius: '16px',
              cursor: 'pointer',
              color: colors.textPrimary,
              '&:hover': {
                borderColor: colors.textPrimary,
              },
              '&:not(:last-of-type)': { marginRight: 8 },
              '&.selected': {
                borderColor: colors.primary,
                color: colors.primary,
                backgroundColor: chroma(colors.primary).alpha(0.1).hex(),
              },
            }}
            onClick={() => {
              if (item.key === time) {
                updateTime(null);
              } else {
                updateTime(item.key);
              }
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
      <GridContainer spacing={2}>
        <GridItem xs={6}>
          <FormField>
            <Label htmlFor="from">From</Label>
            <div
              css={{
                '& .custom-calender': {
                  width: 'max-content',
                },
              }}
            >
              <ReactDatePicker
                id="from"
                name="from"
                selected={typeof time === 'object' ? time?.from : undefined}
                customInput={
                  <Input
                    css={{
                      '& + p': {
                        marginTop: 6,
                      },
                    }}
                    autoComplete={'off'}
                    fullWidth
                    error={isDateError}
                    helperText={isDateError ? 'Invalid time range' : null}
                  />
                }
                closeOnScroll={true}
                onChange={(date) => {
                  if (typeof time === 'object') {
                    if (date === null && !time?.to) {
                      updateTime(null);
                    } else updateTime({ from: date, to: time?.to ?? null });
                  } else {
                    updateTime({ from: date, to: null });
                  }
                }}
                calendarClassName="custom-calender"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </FormField>
        </GridItem>
        <GridItem xs={6}>
          <FormField>
            <Label htmlFor="to">To</Label>
            <div
              css={{
                '& .custom-calender': {
                  width: 'max-content',
                },
              }}
            >
              <ReactDatePicker
                id="to"
                name="to"
                selected={typeof time === 'object' ? time?.to : null}
                customInput={
                  <Input
                    css={{
                      '& + p': {
                        marginTop: 6,
                      },
                    }}
                    autoComplete={'off'}
                    fullWidth
                    error={isDateError}
                    helperText={isDateError ? 'Invalid time range' : null}
                  />
                }
                closeOnScroll={true}
                onChange={(date) => {
                  if (typeof time === 'object') {
                    if (date === null && !time?.from) {
                      updateTime(null);
                    } else updateTime({ from: time?.from ?? null, to: date });
                  } else {
                    updateTime({ from: null, to: date });
                  }
                }}
                calendarClassName="custom-calender"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </FormField>
        </GridItem>
      </GridContainer>
    </div>
  );
}
