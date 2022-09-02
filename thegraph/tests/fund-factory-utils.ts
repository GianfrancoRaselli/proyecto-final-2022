import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { NewFund } from "../generated/FundFactory/FundFactory"

export function createNewFundEvent(
  fundAddress: Address,
  name: string,
  description: string,
  creator: Address,
  createdAt: BigInt
): NewFund {
  let newFundEvent = changetype<NewFund>(newMockEvent())

  newFundEvent.parameters = new Array()

  newFundEvent.parameters.push(
    new ethereum.EventParam(
      "fundAddress",
      ethereum.Value.fromAddress(fundAddress)
    )
  )
  newFundEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  newFundEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  newFundEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  newFundEvent.parameters.push(
    new ethereum.EventParam(
      "createdAt",
      ethereum.Value.fromUnsignedBigInt(createdAt)
    )
  )

  return newFundEvent
}
