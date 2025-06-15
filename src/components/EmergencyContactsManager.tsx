import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { locationService, EmergencyContact } from '@/services/locationService';
import { useToast } from '@/hooks/use-toast';

const EmergencyContactsManager = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    relationship: '',
    is_primary: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const contactList = await locationService.getEmergencyContacts();
    setContacts(contactList);
  };

  const handleAddContact = async () => {
    if (!newContact.contact_name || (!newContact.contact_phone && !newContact.contact_email)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên và ít nhất một thông tin liên hệ",
        variant: "destructive",
      });
      return;
    }

    const success = await locationService.addEmergencyContact(newContact);
    if (success) {
      toast({
        title: "Thành công",
        description: "Đã thêm người liên hệ khẩn cấp",
      });
      setNewContact({
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        relationship: '',
        is_primary: false
      });
      setIsAdding(false);
      loadContacts();
    } else {
      toast({
        title: "Lỗi",
        description: "Không thể thêm người liên hệ",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    // Implementation for deleting contact would go here
    toast({
      title: "Chức năng đang phát triển",
      description: "Tính năng xóa sẽ được cập nhật sớm",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Người liên hệ khẩn cấp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Thêm người liên hệ để họ nhận thông báo khi bạn gặp tình huống khẩn cấp
          </p>

          {/* Existing Contacts */}
          <div className="space-y-3 mb-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{contact.contact_name}</h4>
                        {contact.is_primary && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Chính
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-1">
                        {contact.contact_phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {contact.contact_phone}
                          </div>
                        )}
                        {contact.contact_email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {contact.contact_email}
                          </div>
                        )}
                        {contact.relationship && (
                          <div className="text-xs text-gray-500">
                            Mối quan hệ: {contact.relationship}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Contact */}
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Thêm người liên hệ
            </Button>
          ) : (
            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contact_name">Tên người liên hệ *</Label>
                    <Input
                      id="contact_name"
                      value={newContact.contact_name}
                      onChange={(e) => setNewContact({...newContact, contact_name: e.target.value})}
                      placeholder="Nhập tên"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_phone">Số điện thoại</Label>
                    <Input
                      id="contact_phone"
                      value={newContact.contact_phone}
                      onChange={(e) => setNewContact({...newContact, contact_phone: e.target.value})}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_email">Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={newContact.contact_email}
                      onChange={(e) => setNewContact({...newContact, contact_email: e.target.value})}
                      placeholder="Nhập email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="relationship">Mối quan hệ</Label>
                    <Input
                      id="relationship"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                      placeholder="Ví dụ: Gia đình, Bạn bè, Đồng nghiệp"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_primary"
                      checked={newContact.is_primary}
                      onCheckedChange={(checked) => setNewContact({...newContact, is_primary: checked as boolean})}
                    />
                    <Label htmlFor="is_primary">Người liên hệ chính</Label>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddContact} className="flex-1">
                      Thêm
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAdding(false)}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyContactsManager;
