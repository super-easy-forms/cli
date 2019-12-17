const {Command,flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const {cli} = require('cli-ux');

class DeployCommand extends Command {
  async run() {
    const {args, flags} = this.parse(Deploy)
    if(flags.create){
      cli.action.start('Creating your stack in the AWS cloud')
      SEF.CreateStack(args.name, function(err, data){
        if(err) {
          console.error(err)
          cli.action.stop('Error')
        }
        else {
          cli.action.stop()
          cli.action.start('Fetching your API enpoint URL')
          SEF.GetApiUrl(args.name, data, function(err, data){
            if(err) {
              console.error(err.message)
              cli.action.stop('Error')
            }
            else {
              cli.action.stop()
            }
          })
        }
      })
    }
    else if(flags.update){
      cli.action.start('Updating your stack in the AWS cloud')
      SEF.UpdateStack(args.name, function(err, data){
        if(err) {
          console.error(err.message)
          cli.action.stop('Error')
        }
        else {
          cli.action.stop()
        }
      })
    }
  } 
}

DeployCommand.args = [
  {
    name: 'name',
    required: true,
    description: 'name of the form you want to delete',
  }
]
DeployCommand.flags = {
  create: flags.boolean({
    char: 'c',                    
    description: 'Deploy a new cloudformation stack in the AWS cloud',
    multiple: false,
    required: false,
    exclusive: ['update']         
  }), 
  update: flags.boolean({
    char: 'u',                    
    description: 'Update your stack in the AWS cloud',
    multiple: false,
    required: false,
    exclusive: ['create']         
  })
}

DeployCommand.description = `Deploys your stack in the AWS Cloud`

module.exports = DeployCommand


