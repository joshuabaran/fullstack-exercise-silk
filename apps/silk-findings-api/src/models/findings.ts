import mongoose from 'mongoose'
import { IRawFinding, IGroupedFinding, IFinding } from '@silk-libs/finding-types'

const GroupedFindingSchema = new mongoose.Schema<IGroupedFinding>({
  id: { type: Number, required: true },
  grouping_type: { type: String, required: true },
  grouping_key: { type: String, required: true },
  severity: { type: String, required: true },
  grouped_finding_created: { type: Date, required: true },
  sla: { type: Date, required: true },
  description: { type: String, required: true },
  security_analyst: { type: String, required: true },
  owner: { type: String, required: true },
  workflow: { type: String, required: true },
  status: { type: String, required: true },
  progress: { type: Number, required: true },
})

export const GroupedFindingModel = mongoose.model<IGroupedFinding>('grouped_findings', GroupedFindingSchema)

const RawFindingSchema = new mongoose.Schema<IRawFinding>({
  id: { type: Number, required: true },
  source_security_tool_name: { type: String, required: true },
  source_security_tool_id: { type: String, required: true },
  source_collaboration_tool_name: { type: String, required: true },
  source_collaboration_tool_id: { type: String, required: true },
  severity: { type: String, required: true },
  finding_created: { type: Date, required: true },
  ticket_created: { type: Date, required: true },
  description: { type: String, required: true },
  asset: { type: String, required: true },
  status: { type: String, required: true },
  remediation_url: { type: String, required: true },
  remediation_text: { type: String, required: true },
  grouped_finding_id: { type: Number, required: true },
})

export const RawFindingModel = mongoose.model<IRawFinding>('raw_findings', RawFindingSchema)

export async function getFindings(): Promise<IFinding[]> {
  const pipeline = [
    {
      '$lookup': {
        'from': 'raw_findings', 
        'localField': 'id', 
        'foreignField': 'grouped_finding_id', 
        'as': 'raw'
      }
    }
  ]

  return GroupedFindingModel.aggregate(pipeline).exec()
}
