import React from 'react'
import { TeamTable } from './TeamTable'
import { Card } from '@/components/ui/card'

const page = () => {
  return (
    <Card className='px-5'>
      <TeamTable />
    </Card>
  )
}

export default page