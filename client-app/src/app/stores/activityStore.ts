import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

//Note: use the mobx strict mode if our action is using a async method 
configure({enforceActions: 'always'});

export class ActivityStore{
    //make sure to include the "experimentalDecorators": true inside of our tsconfig.json
    @observable activityRegistry = new Map();
    @observable loadingInitial = false;
    @observable activity: IActivity | null = null;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    }

    //This will load the activity by its ID 
    //Note: use the mobx strict mode if our action is using a async method 
    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list()
            runInAction('loading activities',() => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split('.')[0]
                    this.activityRegistry.set(activity.id, activity)
                  });
                  this.loadingInitial = false;
            })          
        } catch (error) {
            runInAction('loading activities error',() => {             
                this.loadingInitial = false;
            })       
            console.log(error);
        }
    };

    //This is for the loading the specific activity from List activityPage by its ID
    @action loadActivity = async (id:string) => {
        let activity = this.getActivity(id);
        if(activity) {
            this.activity = activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting activity',() => {
                    this.activity = activity;
                    this.loadingInitial = false;
                })
            } catch (error) {
                runInAction('getting activity error',() => {
                    this.loadingInitial = false;
                })
                console.log(error);
            }
        }
    }

    @action clearActvity = () => {
        this.activity = null;
    }

    //This is a helper method to 
    getActivity = (id:string) => {
        return this.activityRegistry.get(id);
    }

    //This will create an activity 
    //Note: use the mobx strict mode if our action is using a async method 
    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('Creating Activity',() => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            })         
        } catch (error) {
            runInAction('Creating Activity Error',() => {
                this.submitting = false;
            })
            console.log(error);
        }
    };

    //This will edit an activity 
    //Note: use the mobx strict mode if our action is using a async method 
    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('Editing Activity',() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            })          
        } catch (error) {
            runInAction('Editing Activity Error',() => {
                this.submitting = false;
            })
            console.log(error);
        }
    }

    //This will delete the activity by its ID
    //Note: use the mobx strict mode if our action is using a async method 
    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true; 
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('Deleting Activity',() => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            })          
        } catch (error) {
            runInAction('Deleting Activity Error',() => {
                this.submitting = false;
                this.target = '';
            })
            console.log(error);
        }
    }
}

export default createContext(new ActivityStore())