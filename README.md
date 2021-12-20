# Blockchain

#Function of the application!
The application serves to make the government process of handing out tenders simpler and more transparent. 

#Overview of the application
The application allows an admin user to create a proposal for a project (example: Road maintenance on the N2). Once the project ahs been proposed, users may tender for the project.
They will submit a tender for a specific proposal and the contract will do a first check to see whether the tender passes the first test. Id it passed, the tender will be applicable 
for the next stage. Each member of a voting commity will then vote for their preffered tender to get the job. The vote is anonymous and they will only be able to vote for tenders
which passed the smart contracts conditions. Once everyone has voted, the admin will tally votes and a winning tender will be awarded.

#Functions
Many functions exist however there are a few main ones worth mentioning. Registering a proposal is the first and can only be done by the admin. The proposal will have a name, 
description, budget and a specified maximum amount of time the project must take.

The next function would be registering a tender for a proposal. This would need the tendering company to provide their name, fee, time they think they will take and a true or false
declaration stating if they are family or friends with anyone apart of the voting commity. The voting commity for that project will be available to view.

Next would be registering a voter. When a voter registers, they just provide their address and they are sorted. This keeps the anonymity.

Voters may vote, this function allows only registered voters to vote, they simply vote for the tender they agree with.

Tally votes will find the tender with the highest votes, for that proposal, and save that as the winning tender for the proposal.

#Future developments
Currently the dapp is simple and there are future functions I am busy adding that will be developed soon.

1.) Specific voting commities: At this time, there are a group of voters and they can vote for any proposals tenders. I am wanting to have each specific proposal to have its own
    voters, this way we can make sure the voters are knowledgable in that field for that proposal. 
    
2.) Payments: The future of the application would be to allow the payments for the projects to happen on the application itself. This is in development.

3.) Gas optimization: At this time, only a few steps have been followed to optimize the gas fee. This is a continuing process and is updated all the time. It is very import to       limit the cost of a smart contract.
