import { Button, FormControlLabel, Paper, Switch, Typography } from '@material-ui/core'
import { green, red } from '@material-ui/core/colors'
import { unwrap } from '@typed/maybe'
import { formatDistanceToNow } from 'date-fns'
import * as React from 'react'
import { FeatureFlag, FeatureFlagStatus, UpdateFeatureFlagOptions } from '../../../domain/model'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { RowAlignCenter, RowBetweenCenter } from '../Flex'

export const FlagSummary = React.memo(function FlagSummary({
  flag,
  selectFlag,
  updateFlag,
}: FlagSummaryProps) {
  const { name, enabled, active, activatedAt, deleted } = flag
  const isTablet = useMediaQuery('(min-width: 30em)')

  return (
    <Paper
      className="ma3 pa2 ph4 pointer center"
      style={{ maxWidth: '1280px' }}
      onClick={selectFlag}
    >
      <RowBetweenCenter>
        <section className="w-100">
          <Typography component="h3" variant="h6" noWrap>
            {name}
          </Typography>

          {unwrap(
            date => (
              <time className="f6 tracked">{formatDistanceToNow(date)}</time>
            ),
            activatedAt,
          )}
        </section>

        {!isTablet && (
          <RowAlignCenter style={{ marginLeft: '1rem' }}>
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: '0.5rem', width: '0.5rem' }}
            >
              <circle cx="50" cy="50" r="50" style={{ fill: active ? green['400'] : red['400'] }} />
            </svg>
          </RowAlignCenter>
        )}

        {isTablet && (
          <RowAlignCenter style={{ marginLeft: '1rem' }}>
            {deleted && (
              <Button
                onClick={ev => {
                  ev.stopPropagation()
                  updateFlag({ name, status: FeatureFlagStatus.Enabled })
                }}
              >
                Restore
              </Button>
            )}

            {!deleted && (
              <>
                {enabled ? (
                  <FormControlLabel
                    onClick={ev => {
                      ev.stopPropagation()
                      updateFlag({
                        name,
                        status: active ? FeatureFlagStatus.Inactive : FeatureFlagStatus.Active,
                      })
                    }}
                    label="Active"
                    control={<Switch color="primary" value={active} checked={active}></Switch>}
                  />
                ) : (
                  <Button disabled>Disabled</Button>
                )}
              </>
            )}
          </RowAlignCenter>
        )}
      </RowBetweenCenter>
    </Paper>
  )
})

export type FlagSummaryProps = {
  readonly flag: FeatureFlag
  readonly updateFlag: (options: UpdateFeatureFlagOptions) => void
  readonly selectFlag: () => void
}
