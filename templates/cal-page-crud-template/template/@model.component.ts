import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { FormArray, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientAccessLicenceService, OrgDetailService, AccountService, DropdownService } from "../../../services";
import { ModelMetadataService, Status, @viewModel, BaseResponse, DropdownOptionViewModel, ClientAccessLicenceTypeEnum, DropdownTypeEnum } from "../../../models";
import { FormComponent, Alert } from "../../form.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { groupBy, ControlHelper, Messages } from "../../../utils";

@Component({
    selector: '@model',
    templateUrl: './@model.component.html',
})
export class @classNameComponent extends FormComponent implements OnInit {

    form: FormGroup;
    viewModels: Array <@viewModel>;
    modalRef: BsModalRef;
    deleteModalRef: BsModalRef;
    deleteViewModelId: number;
    isProviderRequired: boolean;
    clientAccessLicenceType = ClientAccessLicenceTypeEnum.@enum;
    @Input() companyId: number;

    constructor(private router: Router, private route: ActivatedRoute, private accountService: AccountService, private service: ClientAccessLicenceService, private orgService: OrgDetailService, private dropdownService: DropdownService, private metaService: ModelMetadataService, private modalService: BsModalService) {
        super();
        this.viewModels = [];
        this.form = this.metaService.toFormGroup(new @viewModel(), this.metaService.get@viewModel());
    }

    ngOnInit(): void {
        this.submitProcessing = true;
        let params: any = this.route.params;

        this.companyId = params.value.companyId || this.accountService.selectedCompanyId;

        try {
            if(this.companyId) {
                this.service.get@viewModels(this.companyId, this.clientAccessLicenceType).subscribe((response) => {
                    console.info(response);
                    if (response && response.Status == Status.Success && response.Data && response.Data.length > 0) {
                        this.viewModels = response.Data;
                        this.submitProcessing = false;
                    }
                    else if (response && response.Status == Status.BadRequest) {
                        this.redirectToStart();
                    }
                    this.submitProcessing = false;
                });


                this.dropdownService.get(DropdownTypeEnum.@enum_Version).subscribe((response: BaseResponse<Array<DropdownOptionViewModel>>) => {
                    this.versionOptions = response.Data;
                });

                this.dropdownService.get(DropdownTypeEnum.@enum_Edition).subscribe((response: BaseResponse<Array<DropdownOptionViewModel>>) => {
                    this.allEditionOptions = response.Data;
                    const editionOptions = groupBy(response.Data, (x: DropdownOptionViewModel) => x.ParentValue);
                    this.groupedEditionOptions = editionOptions;
                });

                this.dropdownService.get(DropdownTypeEnum.LicenseType).subscribe((response: BaseResponse<Array<DropdownOptionViewModel>>) => {
                    this.licenseTypeOptions = response.Data;
                });

                this.dropdownService.get(DropdownTypeEnum.HostIn).subscribe((response: BaseResponse<Array<DropdownOptionViewModel>>) => {
                    this.hostInOptions = response.Data;
                });

            }
            else {
                this.redirectToStart();
            }

        } catch(e) {
            console.warn(e);

        }

    }

    onSubmit() {
        console.info(this.form.value);
        this.submitProcessing = true;
        this.isFireValidation = true;

        if (this.form.pristine) {
            this.setAlert(new Alert(Messages.UnChangedForm));
            this.submitProcessing = false;
        }
        else if (this.form.valid) {

            try {
                var isAdd: boolean = this.form.value.Id > 0 ? false : true;
                console.info(this.form.value);
                this.service.save@viewModel(this.form.value).subscribe((response) => {
                    console.info(response);
                    if (response.Status == Status.Success) {
                        this.setAlert(new Alert('@uiName is saved successfully', 'success'));
                        this.form.setValue(response.Data);

                        // Adding data in viewModel only for add case
                        if (isAdd)
                            this.viewModels.push(response.Data);
                        else {
                            this.viewModels.forEach((v, i, arr) => {
                                if (v.Id === response.Data.Id) {
                                    arr[i] = response.Data;
                                }
                            });
                        }
                    }
                    else {
                        this.setAlert(new Alert('@uiName could not be saved. Please try again.', 'danger'));
                    }
                    this.submitProcessing = false;
                });
            } catch (e) {
                this.submitProcessing = false;
                console.log('server is not reachable');
            }

        }
        else {
            this.submitProcessing = false;
        }
    }

    onDeleteConfirmation() {
        this.deleteModalRef.hide();
        if (this.deleteViewModelId) {
            this.viewModels.forEach((v, i, arr) => {
                if (v.Id === this.deleteViewModelId) {
                    this.viewModels.splice(i, 1);
                }
            });

            this.service.delete@viewModel(this.deleteViewModelId).subscribe((response) => {
                console.info(response);
            });
        }
    }

    redirectToStart() {
        this.router.navigate([this.accountService.startPath]);
    }

    openEditModel(id: number, template: TemplateRef<any>) {
        var item = this.viewModels.filter(x => x.Id == id)[0];
        if(item) {
            this.onVersionChange(item.Version);
            this.form.setValue(item);
            this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
        }
        else {
            console.log('@uiName not found');
        }
        this.refreshModel();
    }

    openAddModel(template: TemplateRef<any>) {
            let model = new @viewModel();
    model.CompanyId = this.companyId;
    model.ClientAccessLicenceTypeId = this.clientAccessLicenceType;
    this.form.setValue(model);
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.refreshModel();
}

openDeleteModel(id: number, template: TemplateRef<any>) {
    this.deleteViewModelId = id;
    this.deleteModalRef = this.modalService.show(template);
}


    private refreshModel() {
        this.submitProcessing = false;
        this.isFireValidation = false;
        this.onChangeHostIn();
    }

    private onChangeHostIn() {
        let control = this.form.get('HostIn');
        if(control) {
            // reset values as per requirement
            let providerControl = this.form.get('Provider');
            this.service.getHostInId().subscribe(x => {
                if (control && control.value == x) {
                    // enable and required
                    this.isProviderRequired = true;
                    ControlHelper.changeRequired(providerControl, true);
                }
                else {
                    // disable and not requird
                    this.isProviderRequired = false;
                    ControlHelper.changeRequired(providerControl, false);
                    ControlHelper.setValue(providerControl, null);
                }
            });
        }
    }

    onVersionChange(value: any) {
        this.editionOptions = this.groupedEditionOptions.get(parseInt(value));
    }

    versionOptions: Array<DropdownOptionViewModel>;

editionOptions: Array < DropdownOptionViewModel > =[];
groupedEditionOptions: any = {};
    private allEditionOptions: Array < DropdownOptionViewModel > =[];

licenseTypeOptions: Array<DropdownOptionViewModel>;
hostInOptions: Array<DropdownOptionViewModel>;

getVersionName(versionId: number) {
    if (versionId && this.versionOptions && this.versionOptions.length > 0) {
        let version = this.versionOptions.filter(x => x.Value == versionId)[0];
        return version ? version.Text : '';
    }
    else {
        return '';
    }
}

getEditionName(editionId: number) {
    if (editionId && this.allEditionOptions && this.allEditionOptions.length > 0) {
        let edition = this.allEditionOptions.filter(x => x.Value == editionId)[0];
        return edition ? edition.Text : '';
    }
    else {
        return '';
    }
}


getLicenseName(licenceId: number) {
    if (licenceId && this.licenseTypeOptions && this.licenseTypeOptions.length > 0) {
        let version = this.licenseTypeOptions.filter(x => x.Value == licenceId)[0];
        return version ? version.Text : '';
    }
    else {
        return '';
    }
}

getHostInName(hostInId: number) {
    if (hostInId && this.hostInOptions && this.hostInOptions.length > 0) {
        let version = this.hostInOptions.filter(x => x.Value == hostInId)[0];
        return version ? version.Text : '';
    }
    else {
        return '';
    }
}

}

