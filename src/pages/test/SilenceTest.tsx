import { Silence } from '../../sections/Silence'
import { TestShell } from './TestShell'

export function SilenceTest() {
  return (
    <TestShell title="silence" note="one line, and the space around it">
      <Silence line="Nothing to add." />
      <div className="h-[40svh]" />
    </TestShell>
  )
}
