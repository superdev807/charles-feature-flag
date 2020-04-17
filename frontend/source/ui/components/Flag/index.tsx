import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core'
import { withDefault } from '@typed/maybe'
import * as React from 'react'
import {
  FeatureFlag,
  FeatureFlagStatus,
  Permissions,
  UpdateFeatureFlagOptions,
} from '../../../domain/model'
import { formatFeatureFlagActivites } from '../../../domain/services'
import { Activity } from '../Activity'
import { Column, Row, RowAlignCenter, RowWrap } from '../Flex'
import { Disposable } from '@typed/disposable'

import './Flag.css'

export function Flag({ flag, updateFlag, deleteFlag, permissions }: FlagProps) {
  const disposableRef = React.useRef<Disposable>(Disposable.None)
  const [confirmDeletion, setConfirmDeletion] = React.useState(false)
  const isNotDeveloper = permissions !== Permissions.Developer
  const labels = formatFeatureFlagActivites(flag.activity)

  return (
    <section className="pa3">
      <header>
        <RowAlignCenter>
          <Typography component="h2" variant="h3">
            {flag.name}
          </Typography>

          {!isNotDeveloper && !flag.deleted && (
            <Button
              onClick={() => setConfirmDeletion(true)}
              variant="outlined"
              style={{ marginLeft: '1rem' }}
            >
              Delete
            </Button>
          )}
        </RowAlignCenter>
      </header>

      <main className="mv3">
        <Paper style={{ padding: '1rem 2rem' }}>
          <Row>
            <Column>
              <section className="flex flex-column-reverse flex-row-ns items-center-ns">
                <TextField
                  multiline
                  defaultValue={withDefault('', flag.description)}
                  variant="outlined"
                  className="flag--description"
                  inputProps={{
                    onChange: ev => {
                      disposableRef.current.dispose()
                      disposableRef.current = updateFlag({
                        name: flag.name,
                        description: String(ev.currentTarget.value).slice(0, 255),
                      })
                    },
                  }}
                />

                <FormLabel className="mv2 mh2-ns">Description</FormLabel>
              </section>

              <Column className="mv3">
                <FormControlLabel
                  label="Enabled"
                  disabled={isNotDeveloper}
                  control={
                    <Switch
                      disabled={isNotDeveloper}
                      checked={flag.enabled}
                      value={flag.enabled}
                      onClick={() =>
                        updateFlag({
                          name: flag.name,
                          status: flag.enabled
                            ? FeatureFlagStatus.Disabled
                            : FeatureFlagStatus.Enabled,
                        })
                      }
                    />
                  }
                />

                <FormControlLabel
                  label="Active"
                  control={
                    <Switch
                      disabled={!flag.enabled}
                      value={flag.active}
                      checked={flag.active}
                      onClick={() =>
                        updateFlag({
                          name: flag.name,
                          status: flag.active
                            ? FeatureFlagStatus.Inactive
                            : FeatureFlagStatus.Active,
                        })
                      }
                    />
                  }
                />

                <FormControlLabel
                  label="Long-Term"
                  disabled={isNotDeveloper}
                  control={
                    <Switch
                      disabled={isNotDeveloper}
                      value={flag.longTerm}
                      checked={flag.longTerm}
                      onClick={() =>
                        updateFlag({
                          name: flag.name,
                          longTerm: !flag.longTerm,
                        })
                      }
                    />
                  }
                />
              </Column>
            </Column>
          </Row>
        </Paper>

        <RowWrap>
          <Column>
            <Typography component="h3" variant="h4" style={{ marginTop: '1rem' }}>
              Activity
            </Typography>

            <RowWrap>
              {labels.map(label => (
                <Activity key={label.timestamp} {...label} />
              ))}
            </RowWrap>
          </Column>
        </RowWrap>
      </main>

      <Dialog
        open={confirmDeletion}
        onClose={() => setConfirmDeletion(false)}
        aria-labelledby="delete-ff"
      >
        <DialogTitle id="delete-ff">Delete Feature Flag</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you&apos;d like to delete <b>{flag.name}</b>?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmDeletion(false)}>Cancel</Button>

          <Button
            color="primary"
            onClick={() => {
              setConfirmDeletion(false)
              deleteFlag(flag)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  )
}

export type FlagProps = {
  readonly flag: FeatureFlag
  readonly permissions: Permissions
  readonly updateFlag: (options: UpdateFeatureFlagOptions) => Disposable
  readonly deleteFlag: (flag: FeatureFlag) => void
}
