import { newMockEvent } from "matchstick-as"
import { ethereum } from "@graphprotocol/graph-ts"
import { NewFund } from "../generated/FundFactory/FundFactory"

export function createNewFundEvent(name: string, description: string): NewFund {
  let newFundEvent = changetype<NewFund>(newMockEvent())

  newFundEvent.parameters = new Array()

  newFundEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  newFundEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )

  return newFundEvent
}
