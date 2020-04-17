import { Paper } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { unwrap } from '@typed/maybe'
import * as React from 'react'
import { FeatureFlagActivityLabel } from '../../../domain/model'
import { Column, RowAlignCenter } from '../Flex'

export function Activity({ label, userFullName, timestamp }: FeatureFlagActivityLabel) {
  return (
    <Paper
      style={{
        padding: '0.5rem 1rem',
        margin: '0.5rem',
        width: '15rem',
        height: '8rem',
      }}
    >
      <Column>
        <RowAlignCenter>
          <h4 style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{label}</h4>

          {unwrap(
            fullName => (
              <p
                style={{
                  color: grey[600],
                  fontSize: '0.8rem',
                  fontWeight: 300,
                }}
              >
                {fullName}
              </p>
            ),
            userFullName,
          )}
        </RowAlignCenter>

        <p style={{ fontSize: '0.9rem', color: grey[600], fontWeight: 300 }}>{timestamp}</p>
      </Column>
    </Paper>
  )
}
