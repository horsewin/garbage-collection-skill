all:
	ask deploy -p default

l:
	ask lambda upload -f ask-custom-GarbageCollection-default -s ./lambda/custom

log:
	ask lambda log --function ask-custom-GarbageCollection-default --start-time 1hago

submit:
	$(eval SKILLID := $(shell cat .ask/config | jq '.deploy_settings.default.skill_id'))
	ask api submit --skill-id $(SKILLID)
