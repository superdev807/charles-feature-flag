import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import * as React from 'react'
import { FlagTab } from '../../../domain/model'

export function CreateFlag({
  tab,
  createFlag,
  creatingFeatureFlag,
  setCreatingFeatureFlag,
  featureFlagName,
  setFeatureFlagName,
}: CreateFlagProps) {
  return (
    <>
      <Fab
        color="primary"
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
        }}
        onClick={() => setCreatingFeatureFlag(!creatingFeatureFlag)}
      >
        {creatingFeatureFlag ? (
          <CloseIcon style={{ fill: 'white' }} />
        ) : (
          <AddIcon style={{ fill: 'white' }} />
        )}
      </Fab>

      <Dialog
        open={creatingFeatureFlag}
        onClose={() => setCreatingFeatureFlag(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Feature Flag</DialogTitle>

        <DialogContent>
          <TextField
            label="Flag Name"
            inputProps={{
              style: { padding: '1rem' },
              value: featureFlagName,
              onChange: ev => setFeatureFlagName(ev.currentTarget.value),
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCreatingFeatureFlag(false)}>Cancel</Button>

          <Button
            color="primary"
            onClick={() => {
              createFlag(featureFlagName, tab === FlagTab.LongTerm)
              setCreatingFeatureFlag(false)
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export type CreateFlagProps = {
  readonly tab: FlagTab
  readonly createFlag: (name: string, longTerm: boolean) => void
  readonly creatingFeatureFlag: boolean
  readonly setCreatingFeatureFlag: (bool: boolean) => void
  readonly featureFlagName: string
  readonly setFeatureFlagName: (name: string) => void
}
