const {Command, flags} = require('@oclif/command')
const SEF = require('super-easy-forms');
const open = require('open');
const {cli} = require('cli-ux');


class BuildCommand extends Command {
  async run() {
    const {flags} = this.parse(BuildCommand)
    if(flags.profile){
      SEF.Build(flags.region, flags.profile, function(err, data){
        if(err) {
          console.error(err)
          cli.action.stop('Error')
        }
        else{
          SEF.CreateIamUser(flags.profile, flags.region, function(err, data){
            if(err) {
              console.error(err)
              cli.action.stop('Error')
            }
            else{
              open(data);
              cli.action.stop()
              console.log('Finish creating the IAM user and update the local profile in your machine')
            }
          })
        }
      })
    }
    else if(flags.region) SEF.Build(flags.region)
    else SEF.Build()
  }
}

BuildCommand.flags = {
  region: flags.string({
    char: 'r',                    
    description: 'The desired AWS region were your forms infrastructure will be deployed',
    multiple: false,
    required: false         
  }),
  profile: flags.string({
    char: 'p',                    
    description: 'The name of the iam profile/user that you want to create',
    multiple: false,
    required: false,
    dependsOn: ['region']         
  }),
}


BuildCommand.description = `Builds the required base files and directories.`

module.exports = BuildCommand
